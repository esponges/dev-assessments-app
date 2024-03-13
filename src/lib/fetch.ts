export const getUserDetails = async (id: string) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/candidate/details?id=${id}`
  );

  if (!res.ok) {
    throw new Error('Network response was not ok');
  }
  return res.json();
};
