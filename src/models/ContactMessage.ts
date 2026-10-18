import { createPrismaModelAdapter } from "@/lib/prismaModelAdapter";

const ContactMessage = createPrismaModelAdapter("contactMessage", {});

export default ContactMessage;
