// const product ={
//   name: 'product',
//   title: 'Product',
//   type: 'document',
//   fields: [
//   {
//   name: 'id',
//   title: 'ID',
//   type: 'string',
//   },
//   {
//   name: 'name',
//   title: 'Name',
//   type: 'string',
//   },
//   {
//   name: 'image',
//   title: 'Image',
//   type: 'image',
//   },
//   {
//   name: 'imagePath',
//   title: 'Image Path',
//   type: 'url',
//   },
//   {
//   name: 'price',
//   title: 'Price',
//   type: 'number',
//   },
//   {
//   name: 'description',
//   title: 'Description',
//   type: 'text',
//   },
//   {
//   name: 'discountPercentage',
//   title: 'Discount Percentage',
//   type: 'number',
//   },
//   {
//   name: 'isFeaturedProduct',
//   title: 'Is Featured Product',
//   type: 'boolean',
//   },
//   {
//   name: 'stockLevel',
//   title: 'Stock Level',
//   type: 'number',
//   },
//   {
//   name: 'category',
//   title: 'Category',
//   type: 'string',
//   },
//   ],
//  };

//  export default product;














import { defineType,defineField } from "sanity";

export const product = defineType({
  name: 'product',
  type: 'document',
  title: 'Product',
  fields: [
    defineField({
      name: 'name',
      type: 'string',
      title: 'Product Name',
    }),
    defineField({
      title: 'Slug',
      name: 'slug',
      type: 'slug',
      options: {
        source: 'name',
        maxLength: 200, // will be ignored if slugify is set
        slugify: input => input
                             .toLowerCase()
                            .replace(/\s+/g, '-')
                             .slice(0, 200)
      }
    }),
    defineField({
      name: 'description',
      type: 'string',
      title: 'Description'
    }),
    defineField({
      name: 'price',
      type: 'number',
      title: 'Product Price',
    }),
    defineField({
      name: 'discountPercentage',
      type: 'number',
      title: 'Discount Percentage',
    }),
    defineField({
      name: 'isFeaturedProduct',
      type: 'boolean',
      title: 'Is Featured Product',
      description: 'Indicates if the product is featured',
      initialValue: false, // Default value
    }),
    defineField({
      name: 'stockLevel',
      type: 'number',
      title: 'Stock Level',
      description: 'Number of items in stock',
    }),
    defineField({
      name: 'category',
      type: 'string',
      title: 'Category',
      description: 'Add Category from the listed categories'
    }),
    defineField({
      name: 'image',
      type: 'image',
      title: 'Product Image',
      options: {
        hotspot: true // Enables cropping and focal point selection
      }
    })
  ]
});