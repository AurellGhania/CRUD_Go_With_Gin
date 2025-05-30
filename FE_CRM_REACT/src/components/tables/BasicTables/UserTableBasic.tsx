import React, { use } from "react";
//import { useNavigate } from "react-router"; 
import Button from "../../ui/button/Button";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "../../ui/table";
import { getUser, User } from "../../../hooks/user-crud/getUser";
import { deleteUserAPI } from "../../../hooks/user-crud/deleteUser";

export default function BasicUserTable() {
  const [users, setUser] = React.useState<User[]>([]);
  const [loadingDeleteId, setLoadingDeleteId] = React.useState<number | null>(null);
  //const navigate = useNavigate();
  
  // function handleNavigateToUpdateForm(id: number) {
  //   navigate(`/products/update/${id}`);
  // }

  const handleDeleteProduct = async (ID: number) => {
      if (!confirm("Yakin ingin menghapus produk ini?")) return;
  
      try {
        setLoadingDeleteId(ID);
        await deleteUserAPI(ID);
  
        // Hapus produk dari state setelah berhasil delete
        setUser((prev) => prev.filter((p) => p.ID !== ID));
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
        const data = await getUser();
        setUser(data);
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
                Username
              </TableCell>
              <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                Email
              </TableCell>
              <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                Phone Number
              </TableCell>
              <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                Role
              </TableCell>
              <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                Active
              </TableCell>
              {/* <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                Update
              </TableCell> */}
              <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                Delete
              </TableCell>
            </TableRow>
          </TableHeader>

          {/* Table Body */}
          <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
            {users.map((user) => (
              <TableRow key={user.ID}>
                <TableCell className="px-4 py-3 text-gray-500 text-center text-theme-sm dark:text-gray-400">
                  {user.ID}
                </TableCell>
                <TableCell className="px-5 py-4 sm:px-6 text-start">
                  <div className="flex items-center gap-3">
                    <div>
                      <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                        {user.Username}
                      </span>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                  {user.email}
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                  {user.PhoneNumber}
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    {user.IsCRMProfile ? "Admin" : "User"}
                </TableCell>

                <TableCell className="px-4 py-3 text-start">
                {user.IsActive ? (
                    <span className="text-green-600 font-semibold">Active</span>
                ) : (
                    <span className="text-red-600 font-semibold">Inactive</span>
                )}
                </TableCell>


                {/* <TableCell className="px-4 py-3 text-start">
                  <Button variant="solid" color="primary" size="xs"
                    onClick={() => handleNavigateToUpdateForm(user.ID)}>
                    Update
                  </Button>
                </TableCell> */}
                <TableCell className="px-4 py-3 text-start">
                <Button
                  variant="solid"
                  color="error"
                  size="xs"
                  onClick={() => handleDeleteProduct(user.ID)}
                  disabled={loadingDeleteId === user.ID}
                >
                  {loadingDeleteId === user.ID ? "Menghapus..." : "Delete"}
                </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

      </div>
    </div>
  );
}
