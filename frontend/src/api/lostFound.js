const API_URL = import.meta.env.VITE_API_URL;

async function parseResponse(response) {
  if (!response.ok) {
    let detail = `Request failed with status ${response.status}`;
    try {
      const body = await response.json();
      if (typeof body.detail === "string") {
        detail = body.detail;
      } else if (Array.isArray(body.detail) && body.detail[0]?.msg) {
        detail = body.detail[0].msg;
      }
    } catch {
      // response had no JSON body; fall back to the generic message
    }
    throw new Error(detail);
  }
  return response.json();
}

export async function fetchReports({ type, search, status } = {}) {
  const params = new URLSearchParams();

  if (type && type !== "All") params.set("type", type.toUpperCase());
  if (search) params.set("search", search);
  if (status) params.set("status", status);

  const response = await fetch(`${API_URL}/lost-found/reports?${params.toString()}`);
  return parseResponse(response);
}

export async function fetchReport(id) {
  const response = await fetch(`${API_URL}/lost-found/reports/${id}`);

  if (response.status === 404) {
    return null;
  }

  return parseResponse(response);
}

export async function createReport(formData) {
  const response = await fetch(`${API_URL}/lost-found/reports`, {
    method: "POST",
    body: formData,
  });

  return parseResponse(response);
}

export async function updateReportStatus(id, status) {
  const response = await fetch(`${API_URL}/lost-found/reports/${id}/status`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  });

  return parseResponse(response);
}

export function photoUrl(path) {
  if (!path) return null;
  return `${API_URL}${path}`;
}
