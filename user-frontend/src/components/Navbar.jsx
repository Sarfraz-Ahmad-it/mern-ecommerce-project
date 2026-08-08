function Navbar() {
  return (
    <nav className="bg-blue-600 text-white px-8 py-4 flex justify-between items-center">
      <h1 className="text-2xl font-bold">MyShop</h1>

      <ul className="flex gap-6">
        <li className="cursor-pointer hover:text-gray-200">Home</li>
        <li className="cursor-pointer hover:text-gray-200">Products</li>
      </ul>
    </nav>
  );
}

export default Navbar;