const API_URL = import.meta.env.VITE_API_URL;

async function parseResponse(response) {
  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }
  return response.json();
}

export async function fetchProfessors({ search, department } = {}) {
  const params = new URLSearchParams();

  if (search) params.set("search", search);
  if (department && department !== "All") params.set("department", department);

  const response = await fetch(`${API_URL}/professors?${params.toString()}`);
  return parseResponse(response);
}

export async function fetchDepartments() {
  const response = await fetch(`${API_URL}/professors/departments`);
  return parseResponse(response);
}

export async function fetchProfessor(id) {
  const response = await fetch(`${API_URL}/professors/${id}`);

  if (response.status === 404) {
    return null;
  }

  return parseResponse(response);
}
