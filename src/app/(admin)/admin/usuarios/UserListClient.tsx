"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { updateUserRole } from "@/features/auth/actions";

type UserRow = {
	id: string;
	email: string;
	role: string;
	created_at: string;
	full_name?: string;
};

export function UserListClient({
	initialUsers,
	currentUser,
}: {
	initialUsers: UserRow[];
	currentUser: string;
}) {
	const router = useRouter();
	const [searchTerm, setSearchTerm] = useState("");
	const [users, setUsers] = useState(initialUsers);
	const [openDropdown, setOpenDropdown] = useState<string | null>(null);

	const handleRoleChange = async (userId: string, newRole: string) => {
		setOpenDropdown(null);
		if (userId === currentUser) {
			toast.error("No puedes cambiar tu propio rol");
			return;
		}

		const toastId = toast.loading("Actualizando rol...");
		const res = await updateUserRole(userId, newRole);

		if (res.success) {
			toast.success("Rol actualizado", { id: toastId });
			setUsers(
				users.map((u) => (u.id === userId ? { ...u, role: newRole } : u)),
			);
			router.refresh();
		} else {
			toast.error(res.error || "Error al actualizar rol", { id: toastId });
		}
	};

	const filteredUsers = users.filter(
		(u) =>
			u.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
			u.full_name?.toLowerCase().includes(searchTerm.toLowerCase()),
	);

	const getInitials = (email: string, name?: string) => {
		if (name) {
			const parts = name.split(" ");
			if (parts.length > 1) return (parts[0][0] + parts[1][0]).toUpperCase();
			return name.substring(0, 2).toUpperCase();
		}
		return email ? email.substring(0, 2).toUpperCase() : "US";
	};

	const getRoleColor = (role: string) => {
		switch (role?.toLowerCase()) {
			case "admin":
				return "bg-primary text-black";
			case "superadmin":
				return "bg-red-500 text-white";
			case "instructor":
				return "bg-blue-500 text-white";
			default:
				return "bg-zinc-700 text-white";
		}
	};

	return (
		<>
			<section
				className="mb-8 flex gap-4 flex-col md:flex-row"
				data-purpose="table-filters"
			>
				<div className="relative flex-grow max-w-md">
					<input
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
						className="w-full bg-white border-4 border-black p-3 text-black font-bold focus:ring-0 focus:outline-none placeholder-gray-500 focus:shadow-[4px_4px_0px_#1acb5b]"
						placeholder="BUSCAR_POR_EMAIL_O_NOMBRE..."
						type="text"
					/>
				</div>
			</section>

			<section
				className="bg-zinc-900 border-4 border-black shadow-[6px_6px_0px_0px_#000] overflow-x-auto"
				data-purpose="users-management-table"
			>
				<table className="w-full border-collapse min-w-[800px]">
					<thead>
						<tr className="bg-black text-white text-left uppercase text-sm font-bold border-b-4 border-black">
							<th className="p-4 border-r-2 border-zinc-800 w-16">Avatar</th>
							<th className="p-4 border-r-2 border-zinc-800">Email</th>
							<th className="p-4 border-r-2 border-zinc-800">Role</th>
							<th className="p-4 border-r-2 border-zinc-800">Registered</th>
							<th className="p-4 text-center">Actions</th>
						</tr>
					</thead>
					<tbody className="font-medium">
						{filteredUsers.map((user) => (
							<tr
								key={user.id}
								className="border-b-2 border-zinc-800 hover:bg-zinc-800 transition-colors"
							>
								<td className="p-4">
									<div className="w-10 h-10 rounded-full bg-primary border-2 border-black flex items-center justify-center text-black font-black text-sm">
										{getInitials(user.email, user.full_name)}
									</div>
								</td>
								<td className="p-4">
									<div className="text-zinc-300 font-mono">
										{user.email || "Sin Email"}
									</div>
									{user.full_name && (
										<div className="text-xs text-zinc-500">
											{user.full_name}
										</div>
									)}
								</td>
								<td className="p-4">
									<span
										className={`${getRoleColor(user.role)} text-xs font-black px-3 py-1 border-2 border-black shadow-[2px_2px_0px_0px_#000] uppercase`}
									>
										{user.role || "user"}
									</span>
								</td>
								<td className="p-4 text-zinc-400 text-sm">
									{new Date(user.created_at).toISOString().split("T")[0]}
								</td>
								<td className="p-4 text-center relative">
									<div className="relative inline-block text-left">
										<button
											onClick={() =>
												setOpenDropdown(
													openDropdown === user.id ? null : user.id,
												)
											}
											className="bg-white text-black px-3 py-1 text-xs font-black border-2 border-black shadow-[2px_2px_0px_0px_#000] uppercase tracking-tight hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[3px_3px_0px_0px_#000] transition-all"
										>
											Change Role ▾
										</button>
										{openDropdown === user.id && (
											<div className="absolute right-0 mt-1 w-32 bg-white border-2 border-black z-10 shadow-[4px_4px_0px_#000]">
												<button
													onClick={() => handleRoleChange(user.id, "admin")}
													className="block w-full text-left px-3 py-2 text-xs font-bold text-black hover:bg-primary border-b border-black"
												>
													ADMIN
												</button>
												<button
													onClick={() =>
														handleRoleChange(user.id, "instructor")
													}
													className="block w-full text-left px-3 py-2 text-xs font-bold text-black hover:bg-primary border-b border-black"
												>
													INSTRUCTOR
												</button>
												<button
													onClick={() => handleRoleChange(user.id, "user")}
													className="block w-full text-left px-3 py-2 text-xs font-bold text-black hover:bg-primary"
												>
													USER
												</button>
											</div>
										)}
									</div>
								</td>
							</tr>
						))}
						{filteredUsers.length === 0 && (
							<tr>
								<td
									colSpan={5}
									className="p-8 text-center text-gray-400 font-bold uppercase italic border-t-4 border-black"
								>
									No se encontraron usuarios.
								</td>
							</tr>
						)}
					</tbody>
				</table>
			</section>
		</>
	);
}
