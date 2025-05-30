import React from "react";
import { useNavigate } from "react-router"; // harusnya "react-router-dom", bukan "react-router"
import Button from "../../ui/button/Button";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "../../ui/table";
import { getProducts, Product } from "../../../hooks/product-crud/getProduct";
import { deleteProductAPI } from "../../../hooks/product-crud/delateProduct";

export default function BasicProductTable() {
  const [products, setProducts] = React.useState<Product[]>([]);
  const [loadingDeleteId, setLoadingDeleteId] = React.useState<number | null>(null);
  const navigate = useNavigate();
  const baseUrl = import.meta.env.VITE_NEXT_PUBLIC_BASE_URL;

  
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [selectedImage, setSelectedImage] = React.useState<string | null>(null);

  function openModal(image: string) {
    setSelectedImage(image);
    setIsModalOpen(true);
  }

  function closeModal() {
    setIsModalOpen(false);
    setSelectedImage(null);
  }

  function handleNavigateToUpdateForm(ID: number) {
    navigate(`/products/update-product/${ID}`);
  }

  const handleDeleteProduct = async (ID: number) => {
    if (!confirm("Yakin ingin menghapus produk ini?")) return;

    try {
      setLoadingDeleteId(ID);
      await deleteProductAPI(ID);

      // Hapus produk dari state setelah berhasil delete
      setProducts((prev) => prev.filter((p) => p.ID !== ID));
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("Gagal menghapus produk");
    } finally {
      setLoadingDeleteId(null);
    }
  };
  
  React.useEffect(() => {
    async function fetchProducts() {
      try {
        const data = await getProducts();
        setProducts(data);
      } catch (error) {
        console.error(error);
      }
    }

    fetchProducts();
  }, []);

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="max-w-full overflow-x-auto">
        <Table>
          {/* Table Header */}
          <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
            <TableRow>
              <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-center text-theme-xs dark:text-gray-400">
                ID
              </TableCell>
              <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                Name
              </TableCell>
              <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                Description
              </TableCell>
              <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                Price
              </TableCell>
              <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                Stock
              </TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                Category ID
              </TableCell>
              <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                Category Name
              </TableCell>
              <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                Image
              </TableCell>
              <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                Update
              </TableCell>
              <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                Delete
              </TableCell>
            </TableRow>
          </TableHeader>

          {/* Table Body */}
          <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
            {products.map((product) => (
              <TableRow key={product.ID}>
                <TableCell className="px-4 py-3 text-gray-500 text-center text-theme-sm dark:text-gray-400">
                  {product.ID}
                </TableCell>
                <TableCell className="px-5 py-4 sm:px-6 text-start">
                  <div className="flex items-center gap-3">
                    <div>
                      <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                        {product.name}
                      </span>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                  {product.description}
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                  {product.price}
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                  {product.stock}
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-500 text-center text-theme-sm dark:text-gray-400">
                  {product.category.ID}
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                  {product.category.name}
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                  <div className="flex -space-x-2">
                    {product.images.map((img, idx) => (
                      <div
                        key={idx}
                        className="w-6 h-6 overflow-hidden border-2 border-white rounded-md dark:border-gray-900 cursor-pointer"
                        onClick={() => openModal(`${baseUrl}/${img}`)} // Memanggil openModal dengan gambar yang dipilih
                      >
                        <img
                          width={24}
                          height={24}
                          src={`${baseUrl}/${img}`}
                          alt={`Product ${product.ID} image`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </TableCell>
                <TableCell className="px-4 py-3 text-start">
                  <Button variant="solid" color="primary" size="xs"
                    onClick={() => handleNavigateToUpdateForm(product.ID)}>
                    Update
                  </Button>
                </TableCell>
                <TableCell className="px-4 py-3 text-start">
                <Button
                  variant="solid"
                  color="error"
                  size="xs"
                  onClick={() => handleDeleteProduct(product.ID)}
                  disabled={loadingDeleteId === product.ID}
                >
                  {loadingDeleteId === product.ID ? "Menghapus..." : "Delete"}
                </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Modal untuk Menampilkan Gambar Besar */}
        {isModalOpen && (
          <div className="relative z-10" aria-labelledby="modal-title" role="dialog" aria-modal="true">
            <div className="fixed inset-0 bg-gray-500/75 transition-opacity" aria-hidden="true"></div>

            <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
              <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                  <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                    <div className="sm:flex sm:items-start">
                      <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                        <img
                          src={selectedImage || ''}
                          alt="Selected Product"
                          className="max-w-full max-h-[80vh] object-contain"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                    <button type="button" onClick={closeModal} className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-xs ring-1 ring-gray-300 ring-inset hover:bg-gray-50 sm:mt-0 sm:w-auto">Close</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
