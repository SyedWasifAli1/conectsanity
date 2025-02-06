import { defineType, defineField, defineArrayMember } from "sanity";

export const order = defineType({
  name: "order",
  title: "Order",
  type: "document",
  fields: [
    defineField({
      name: "items",
      title: "Items",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          name: "orderItem", // ✅ Correct `_type`
          fields: [
            defineField({ name: "name", title: "Name", type: "string" }),
            defineField({ name: "quantity", title: "Quantity", type: "number" }),
            defineField({ name: "price", title: "Price", type: "number" }),
          ],
        }),
      ],
    }),
    defineField({
      name: "createdAt",
      title: "Created At",
      type: "datetime",
      initialValue: new Date().toISOString(),
    }),
  ],
});
