export const uploadImage = async (image) => {
  const api = process.env.NEXT_PUBLIC_IMGBB_API_KEY;

  const formatedImage = new FormData();
  formatedImage.append('image', image)

  const res = await fetch(`https://api.imgbb.com/1/upload?key=${api}`, {
    method: "POST",
    body: formatedImage
  });

  return res.json()
}
