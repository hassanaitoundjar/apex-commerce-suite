import prisma from "./prisma";

export function filterToPrismaWhere(filter: any): any {
  if (!filter || typeof filter !== "object") return {};
  const where: any = {};

  for (const [key, value] of Object.entries(filter)) {
    if (key === "$or" && Array.isArray(value)) {
      where.OR = value.map((f) => filterToPrismaWhere(f));
      continue;
    }
    if (key === "$and" && Array.isArray(value)) {
      where.AND = value.map((f) => filterToPrismaWhere(f));
      continue;
    }

    const targetKey = key === "_id" ? "id" : key;

    // Handle nested dot notation like "customer.email" or "customer.phone"
    if (targetKey.includes(".")) {
      const parts = targetKey.split(".");
      if (parts[0] === "customer") {
        if (value && typeof value === "object" && "$regex" in value) {
          const reg = (value as any).$regex;
          const strVal = reg instanceof RegExp ? reg.source.replace(/^\^|\$$/g, "") : String(reg).replace(/^\^|\$$/g, "");
          where.customer = {
            path: [parts[1]],
            string_contains: strVal,
          };
        } else if (value && typeof value === "object" && "$in" in value) {
          where.OR = (value as any).$in.map((v: string) => ({
            customer: { path: [parts[1]], equals: v }
          }));
        } else {
          where.customer = {
            path: [parts[1]],
            equals: value,
          };
        }
        continue;
      }
    }

    if (value === undefined) continue;

    if (value instanceof RegExp) {
      const cleanPattern = value.source.replace(/^\^|\$$/g, "");
      where[targetKey] = {
        contains: cleanPattern,
        mode: "insensitive",
      };
      continue;
    }

    if (value && typeof value === "object" && !Array.isArray(value) && !(value instanceof Date)) {
      const fieldOps: any = {};
      let hasOp = false;

      if ("$regex" in value) {
        const reg = (value as any).$regex;
        const cleanPattern = reg instanceof RegExp ? reg.source.replace(/^\^|\$$/g, "") : String(reg).replace(/^\^|\$$/g, "");
        where[targetKey] = {
          contains: cleanPattern,
          mode: "insensitive",
        };
        continue;
      }

      if ("$in" in value) {
        const inArr = (value as any).$in;
        if (targetKey === "sizes" || targetKey === "colors") {
          where[targetKey] = {
            hasSome: Array.isArray(inArr) ? inArr : [inArr],
          };
        } else {
          fieldOps.in = inArr;
        }
        hasOp = true;
      }

      if ("$nin" in value) {
        fieldOps.notIn = (value as any).$nin;
        hasOp = true;
      }

      if ("$ne" in value) {
        fieldOps.not = (value as any).$ne;
        hasOp = true;
      }

      if ("$gt" in value) {
        fieldOps.gt = (value as any).$gt;
        hasOp = true;
      }

      if ("$gte" in value) {
        fieldOps.gte = (value as any).$gte;
        hasOp = true;
      }

      if ("$lt" in value) {
        fieldOps.lt = (value as any).$lt;
        hasOp = true;
      }

      if ("$lte" in value) {
        fieldOps.lte = (value as any).$lte;
        hasOp = true;
      }

      if (hasOp) {
        where[targetKey] = fieldOps;
      } else {
        where[targetKey] = value;
      }
    } else {
      where[targetKey] = value;
    }
  }

  return where;
}

export function sortToPrismaOrderBy(sort: any): any {
  if (!sort) return undefined;
  if (typeof sort === "string") {
    const isDesc = sort.startsWith("-");
    const field = isDesc ? sort.substring(1) : sort;
    return { [field === "_id" ? "id" : field]: isDesc ? "desc" : "asc" };
  }
  if (typeof sort === "object") {
    const orderBy: any = {};
    for (const [k, v] of Object.entries(sort)) {
      const field = k === "_id" ? "id" : k;
      orderBy[field] = v === -1 || v === "desc" ? "desc" : "asc";
    }
    return orderBy;
  }
  return undefined;
}

export function sanitizeDataForPrisma(data: any): any {
  if (!data || typeof data !== "object") return data;
  const clean: any = {};

  let source = { ...data };
  if (source.$set) {
    source = { ...source, ...source.$set };
    delete source.$set;
  }
  if (source.$setOnInsert) {
    source = { ...source, ...source.$setOnInsert };
    delete source.$setOnInsert;
  }

  for (const [k, v] of Object.entries(source)) {
    if (k === "_id") {
      clean.id = v;
      continue;
    }
    if (k === "$inc" && typeof v === "object" && v !== null) {
      for (const [incKey, incVal] of Object.entries(v as any)) {
        clean[incKey] = { increment: incVal };
      }
      continue;
    }
    if (k.startsWith("$")) continue;
    clean[k] = v;
  }
  return clean;
}

export function wrapDocument(doc: any, delegateName?: string): any {
  if (!doc || typeof doc !== "object") return doc;
  if (!doc._id && doc.id) {
    doc._id = doc.id;
  }
  if (!doc.toObject) {
    Object.defineProperty(doc, "toObject", {
      value: function () {
        return { ...this };
      },
      enumerable: false,
      writable: true,
    });
  }
  if (!doc.save) {
    Object.defineProperty(doc, "save", {
      value: async function () {
        if (!delegateName) return this;
        const delegate = (prisma as any)[delegateName];
        if (!delegate) return this;
        const clean = sanitizeDataForPrisma(this);
        const { id, _id, ...rest } = clean;
        const updated = await delegate.update({
          where: { id: this.id || this._id },
          data: rest,
        });
        return wrapDocument(updated, delegateName);
      },
      enumerable: false,
      writable: true,
    });
  }
  return doc;
}

type QueryType = "findMany" | "findFirst" | "findOneAndUpdate" | "findByIdAndUpdate" | "findOneAndDelete" | "findByIdAndDelete";

export class QueryBuilder<T = Record<string, any>> implements PromiseLike<T> {
  private delegateName: string;
  private queryType: QueryType;
  private filter: any;
  private updateData?: any;
  private options?: any;
  private defaultValues?: any;
  private orderByClause: any;
  private skipCount?: number;
  private takeCount?: number;
  private selectClause?: any;

  constructor(
    delegateName: string,
    queryType: QueryType,
    filter: any,
    updateData?: any,
    options?: any,
    defaultValues?: any
  ) {
    this.delegateName = delegateName;
    this.queryType = queryType;
    this.filter = filter;
    this.updateData = updateData;
    this.options = options;
    this.defaultValues = defaultValues || {};
  }

  sort(sortOptions: any): QueryBuilder<T> {
    this.orderByClause = sortToPrismaOrderBy(sortOptions);
    return this;
  }

  skip(count: number): QueryBuilder<T> {
    this.skipCount = count;
    return this;
  }

  limit(count: number): QueryBuilder<T> {
    this.takeCount = count;
    return this;
  }

  select(fields: any): QueryBuilder<T> {
    if (typeof fields === "string") {
      const parts = fields.trim().split(/\s+/);
      const isExclude = parts.some((p) => p.startsWith("-"));
      if (!isExclude) {
        this.selectClause = {};
        parts.forEach((p) => {
          this.selectClause[p === "_id" ? "id" : p] = true;
        });
      }
    }
    return this;
  }

  lean(): QueryBuilder<T> {
    return this;
  }

  populate(_path?: any, _select?: any): QueryBuilder<T> {
    return this;
  }

  async exec(): Promise<T> {
    const delegate = (prisma as any)[this.delegateName];
    if (!delegate) {
      throw new Error(`Prisma delegate '${this.delegateName}' not found`);
    }

    if (this.queryType === "findMany") {
      const where = filterToPrismaWhere(this.filter);
      const results = await delegate.findMany({
        where,
        orderBy: this.orderByClause,
        skip: this.skipCount,
        take: this.takeCount,
        select: this.selectClause,
      });
      return results.map((r: any) => wrapDocument(r, this.delegateName)) as unknown as T;
    }

    if (this.queryType === "findFirst") {
      const where = filterToPrismaWhere(this.filter);
      const res = await delegate.findFirst({
        where,
        orderBy: this.orderByClause,
        select: this.selectClause,
      });
      return wrapDocument(res, this.delegateName) as unknown as T;
    }

    if (this.queryType === "findOneAndUpdate") {
      const where = filterToPrismaWhere(this.filter);
      const existing = await delegate.findFirst({ where });
      if (existing) {
        const clean = sanitizeDataForPrisma(this.updateData);
        const { id, _id, ...rest } = clean;
        const updated = await delegate.update({
          where: { id: existing.id },
          data: rest,
          select: this.selectClause,
        });
        return wrapDocument(updated, this.delegateName) as unknown as T;
      } else if (this.options?.upsert) {
        const clean = sanitizeDataForPrisma(this.updateData);
        const filterDefaults = sanitizeDataForPrisma(this.filter);
        const payload = { ...this.defaultValues, ...filterDefaults, ...clean };
        const created = await delegate.create({
          data: payload,
          select: this.selectClause,
        });
        return wrapDocument(created, this.delegateName) as unknown as T;
      }
      return null as unknown as T;
    }

    if (this.queryType === "findByIdAndUpdate") {
      const id = typeof this.filter === "string" ? this.filter : this.filter?.id || this.filter?._id;
      const clean = sanitizeDataForPrisma(this.updateData);
      const { id: _, _id: __, ...rest } = clean;
      const updated = await delegate.update({
        where: { id },
        data: rest,
        select: this.selectClause,
      });
      return wrapDocument(updated, this.delegateName) as unknown as T;
    }

    if (this.queryType === "findOneAndDelete") {
      const where = filterToPrismaWhere(this.filter);
      const target = await delegate.findFirst({ where });
      if (!target) return null as unknown as T;
      const deleted = await delegate.delete({ where: { id: target.id } });
      return wrapDocument(deleted, this.delegateName) as unknown as T;
    }

    if (this.queryType === "findByIdAndDelete") {
      const id = typeof this.filter === "string" ? this.filter : this.filter?.id || this.filter?._id;
      try {
        const deleted = await delegate.delete({ where: { id } });
        return wrapDocument(deleted, this.delegateName) as unknown as T;
      } catch (e) {
        return null as unknown as T;
      }
    }

    return null as unknown as T;
  }

  then<TResult1 = T, TResult2 = never>(
    onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | null,
    onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | null
  ): Promise<TResult1 | TResult2> {
    return this.exec().then(onfulfilled, onrejected);
  }

  catch<TResult = never>(
    onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | null
  ): Promise<T | TResult> {
    return this.exec().catch(onrejected);
  }

  finally(onfinally?: (() => void) | null): Promise<T> {
    return this.exec().finally(onfinally);
  }
}

export interface IPrismaModelAdapter {
  find(filter?: any): QueryBuilder<Array<Record<string, any>>>;
  findOne(filter?: any): QueryBuilder<any>;
  findById(id: string): QueryBuilder<any>;
  create(data: any | any[]): Promise<any>;
  insertMany(data: any[]): Promise<any[]>;
  findOneAndUpdate(filter: any, update: any, options?: any): QueryBuilder<any>;
  findByIdAndUpdate(id: string, update: any, options?: any): QueryBuilder<any>;
  findOneAndDelete(filter: any, options?: any): QueryBuilder<any>;
  findByIdAndDelete(id: string, options?: any): QueryBuilder<any>;
  deleteOne(filter: any): Promise<{ deletedCount: number }>;
  deleteMany(filter?: any): Promise<{ deletedCount: number }>;
  updateOne(filter: any, update: any): Promise<{ matchedCount: number; modifiedCount: number }>;
  updateMany(filter: any, update: any): Promise<{ matchedCount: number; modifiedCount: number }>;
  countDocuments(filter?: any): Promise<number>;
  distinct(field: string, filter?: any): Promise<any[]>;
  aggregate(pipeline?: any[]): Promise<any[]>;
  bulkWrite(operations: any[], options?: any): Promise<{ upsertedCount: number; modifiedCount: number }>;
  [key: string]: any;
}

export function createPrismaModelAdapter(delegateName: string, defaultValues: Record<string, any> = {}): IPrismaModelAdapter {
  const getDelegate = () => {
    const del = (prisma as any)[delegateName];
    if (!del) throw new Error(`Prisma model '${delegateName}' does not exist on PrismaClient`);
    return del;
  };

  return {
    find(filter?: any): QueryBuilder<Array<Record<string, any>>> {
      return new QueryBuilder<Array<Record<string, any>>>(delegateName, "findMany", filter);
    },

    findOne(filter?: any) {
      return new QueryBuilder<any>(delegateName, "findFirst", filter);
    },

    findById(id: string) {
      return new QueryBuilder<any>(delegateName, "findFirst", { _id: id });
    },

    async create(data: any | any[]) {
      const delegate = getDelegate();
      const executeCreate = async (payload: any) => {
        try {
          return await delegate.create({ data: payload });
        } catch (err: any) {
          if (err?.message && err.message.includes("Unknown argument")) {
            const match = err.message.match(/Unknown argument `(\w+)`/);
            if (match && match[1]) {
              const cleaned = { ...payload };
              delete cleaned[match[1]];
              return await delegate.create({ data: cleaned });
            }
          }
          throw err;
        }
      };

      if (Array.isArray(data)) {
        const created: any[] = [];
        for (const item of data) {
          const payload = { ...defaultValues, ...sanitizeDataForPrisma(item) };
          const res = await executeCreate(payload);
          created.push(wrapDocument(res, delegateName));
        }
        return created;
      } else {
        const payload = { ...defaultValues, ...sanitizeDataForPrisma(data) };
        const res = await executeCreate(payload);
        return wrapDocument(res, delegateName);
      }
    },

    async insertMany(data: any[]) {
      return this.create(data);
    },

    findOneAndUpdate(filter: any, update: any, options: any = {}) {
      return new QueryBuilder<any>(delegateName, "findOneAndUpdate", filter, update, options, defaultValues);
    },

    findByIdAndUpdate(id: string, update: any, options: any = {}) {
      return new QueryBuilder<any>(delegateName, "findByIdAndUpdate", id, update, options, defaultValues);
    },

    findOneAndDelete(filter: any, options: any = {}) {
      return new QueryBuilder<any>(delegateName, "findOneAndDelete", filter, undefined, options);
    },

    findByIdAndDelete(id: string, options: any = {}) {
      return new QueryBuilder<any>(delegateName, "findByIdAndDelete", id, undefined, options);
    },

    async deleteOne(filter: any) {
      const delegate = getDelegate();
      const where = filterToPrismaWhere(filter);
      const target = await delegate.findFirst({ where });
      if (!target) return { deletedCount: 0 };
      await delegate.delete({ where: { id: target.id } });
      return { deletedCount: 1 };
    },

    async deleteMany(filter: any = {}) {
      const delegate = getDelegate();
      const where = filterToPrismaWhere(filter);
      const result = await delegate.deleteMany({ where });
      return { deletedCount: result.count };
    },

    async updateOne(filter: any, update: any) {
      const delegate = getDelegate();
      const where = filterToPrismaWhere(filter);
      const target = await delegate.findFirst({ where });
      if (!target) return { matchedCount: 0, modifiedCount: 0 };
      const clean = sanitizeDataForPrisma(update);
      const { id, _id, ...rest } = clean;
      await delegate.update({
        where: { id: target.id },
        data: rest,
      });
      return { matchedCount: 1, modifiedCount: 1 };
    },

    async updateMany(filter: any, update: any) {
      const delegate = getDelegate();
      const where = filterToPrismaWhere(filter);
      const clean = sanitizeDataForPrisma(update);
      const { id, _id, ...rest } = clean;
      const result = await delegate.updateMany({
        where,
        data: rest,
      });
      return { matchedCount: result.count, modifiedCount: result.count };
    },

    async countDocuments(filter: any = {}) {
      const delegate = getDelegate();
      const where = filterToPrismaWhere(filter);
      return delegate.count({ where });
    },

    async distinct(field: string, filter: any = {}) {
      const delegate = getDelegate();
      const where = filterToPrismaWhere(filter);
      const targetField = field === "_id" ? "id" : field;

      if (targetField === "sizes" || targetField === "colors" || targetField === "images" || targetField === "attributes") {
        const records = await delegate.findMany({ where, select: { [targetField]: true } });
        const allItems = records.flatMap((r: any) => r[targetField] || []);
        return Array.from(new Set(allItems));
      }

      const records = await delegate.findMany({
        where,
        select: { [targetField]: true },
        distinct: [targetField],
      });
      return records.map((r: any) => r[targetField]).filter((v: any) => v !== null && v !== undefined);
    },

    async aggregate(pipeline: any[] = []) {
      const delegate = getDelegate();
      let matchStage: any = null;
      let groupStage: any = null;

      for (const stage of pipeline) {
        if (stage.$match) matchStage = stage.$match;
        if (stage.$group) groupStage = stage.$group;
      }

      const where = matchStage ? filterToPrismaWhere(matchStage) : {};

      if (groupStage && groupStage.total && groupStage.total.$sum === "$total") {
        const agg = await delegate.aggregate({
          where,
          _sum: { total: true },
        });
        return [{ total: agg._sum?.total || 0 }];
      }

      return [];
    },

    async bulkWrite(operations: any[], options: any = {}) {
      const delegate = getDelegate();
      let upsertedCount = 0;
      let modifiedCount = 0;

      for (const op of operations) {
        if (op.updateOne) {
          const { filter, update, upsert } = op.updateOne;
          const where = filterToPrismaWhere(filter);
          const existing = await delegate.findFirst({ where });
          const clean = sanitizeDataForPrisma(update);
          const { id, _id, ...rest } = clean;

          if (existing) {
            await delegate.update({
              where: { id: existing.id },
              data: rest,
            });
            modifiedCount++;
          } else if (upsert) {
            const filterDefaults = sanitizeDataForPrisma(filter);
            await delegate.create({
              data: { ...defaultValues, ...filterDefaults, ...rest },
            });
            upsertedCount++;
          }
        }
      }

      return { upsertedCount, modifiedCount };
    },
  };
}
