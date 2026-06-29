'use client'
import { uploadImage } from '@/lib/uploadImage';
import React from 'react';

const AddProductPage = () => {

  const onSubmit = async (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    const formEntries = Object.fromEntries(formData.entries())
    const image = await uploadImage(formEntries.image)
    // console.log(image.data.url)
    // console.log('formEntries:', formEntries)
  }

  return (
    <div className="p-10">
      <div className="flex flex-col gap-5">
        <h1 className="font-semibold text-2xl text-gray-800">Add Product</h1>
        <p className="text-gray-500">Add new product to your store</p>
      </div>
        <form onSubmit={onSubmit} className="flex flex-col">
          <label> Name: </label>
          <input name="name" type="text" className="border-2" />
          <label> Description: </label>
          <input name="description" type="text" className="border-2" />
          <label> Image: </label>
          <input name="image" type="file" className="border-2" />
          <button type='submit' className='bg-amber-900 text-2xl cursor-pointer my-2'>Submit</button>
        </form>
    </div>
  );
};

export default AddProductPage;
