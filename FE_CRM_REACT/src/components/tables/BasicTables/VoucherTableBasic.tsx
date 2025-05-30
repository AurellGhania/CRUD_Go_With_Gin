import React from "react";
import { useNavigate } from "react-router"; // harusnya "react-router-dom", bukan "react-router"
import { Voucher, getVouher } from "../../../hooks/voucher-crud/getVoucher";
import Button from "../../ui/button/Button";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "../../ui/table";
import { deleteVoucherAPI } from "../../../hooks/voucher-crud/deleteVoucher";

export default function BasicVoucherTable() {
  const [vouchers, setVouchet] = React.useState<Voucher[]>([]);
  const [loadingDeleteId, setLoadingDeleteId] = React.useState<number | null>(null);
  const navigate = useNavigate();

  // Ilh

  function handleNavigateToUpdateForm(ID: number) {
    navigate(`/vouchers/update-voucher/${ID}`);
  }

  const handleDeleteVoucher = async (ID: number) => {
    if (!confirm("Yakin ingin menghapus produk ini?")) return;

    try {
      setLoadingDeleteId(ID);
      await deleteVoucherAPI(ID);

      // Hapus produk dari state setelah berhasil delete
      setVouchet((prev) => prev.filter((p) => p.ID !== ID));
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
        const data = await getVouher();
        setVouchet(data);
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
                Code
              </TableCell>
              <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-center text-theme-xs dark:text-gray-400">
                Expired Use
              </TableCell>
              <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                Expired Voucher
              </TableCell>
              <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                Update
              </TableCell>
              <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                Delate
              </TableCell>

            </TableRow>
          </TableHeader>

          {/* Table Body */}
          <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
            {vouchers.map((voucher) => (
              <TableRow key={voucher.ID}>
                <TableCell className="px-4 py-3 text-gray-500 text-center text-theme-sm dark:text-gray-400">
                  {voucher.ID}
                </TableCell>
                <TableCell className="px-5 py-4 sm:px-6 text-start">
                  <div className="flex items-center gap-3">
                    <div>
                      <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                        {voucher.code}
                      </span>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="px-5 py-4 sm:px-6 text-start">
                  <div className="flex items-center gap-3">
                    <div>
                      <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                        {voucher.expired_use}
                      </span>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="px-5 py-4 sm:px-6 text-start">
                  <div className="flex items-center gap-3">
                    <div>
                      <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                        {voucher.expired_voucher}
                      </span>
                    </div>
                  </div>
                </TableCell>

                <TableCell className="px-4 py-3 text-start">
                  <Button variant="solid" color="primary" size="xs"
                    onClick={() => handleNavigateToUpdateForm(voucher.ID)}>
                    Update
                  </Button>
                </TableCell>
                <TableCell className="px-4 py-3 text-start">
                  <Button
                    variant="solid"
                    color="error"
                    size="xs"
                    onClick={() => handleDeleteVoucher(voucher.ID)}
                    disabled={loadingDeleteId === voucher.ID}
                  >
                    {loadingDeleteId === voucher.ID ? "Menghapus..." : "Delete"}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Modal untuk Menampilkan Gambar Besar */}
      </div>
    </div>
  );
}
