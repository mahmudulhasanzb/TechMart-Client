'use client'
import React from 'react';

const AddProductPage = () => {

  const onSubmit = (e) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const data = Object.fromEntries(formData.entries())
    console.log(data)
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
          <button type='submit' className='bg-amber-900 text-2xl'>Submit</button>
        </form>
    </div>
  );
};

export default AddProductPage;
