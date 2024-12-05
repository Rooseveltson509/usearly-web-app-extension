// apiService.ts

import { Alert } from '../types/Alert';
import { getToken } from '../utils/storageUtil';

const API_URL = 'https://20d2-217-128-226-57.ngrok-free.app/api/v1';
const API_BASE_URL = 'https://usearly-api.vercel.app/api/v1';

export interface UpdateAlertResponse {
  success: boolean;
  message?: string;
  error?: string;
}

const url = `${API_URL}/user/alert/new`;
const url2 = `${API_URL}/test-cors`;

/**
 * Effectue une requête POST pour créer un signalement.
 * @param alertData - Les données du signalement à envoyer au serveur.
 * @param token - Le token d'authentification Bearer.
 * @returns La réponse JSON du serveur ou une erreur si la requête échoue.
 */
export const createAlert = async (
  alertData: Alert,
  token: string
): Promise<UpdateAlertResponse> => {
  const currentUrl = window.location.href;
  const urlObj = new URL(currentUrl);
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Origin: currentUrl,
      Authorization: `Bearer ${token}`,
    },
    mode: 'cors',
    body: JSON.stringify(alertData),
  });

  if (!response.ok) {
    const errorData: ApiError = await response.json();
    throw errorData; // Lance une erreur avec ApiError
  }

  return await response.json();
};


/**
 * Met à jour la catégorie d'un signalement.
 * @param category - La catégorie du signalement à mettre à jour.
 * @param token - Le token d'authentification Bearer.
 * @returns La réponse JSON du serveur ou une erreur si la requête échoue.
 */
export const updateAlert = async (category: string, token: string): Promise<UpdateAlertResponse> => {
  try {
    const response = await fetch(`${API_URL}/user/update-category`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Origin: "chrome-extension://fjcggidednblenggahpkilfidbalhmad",
        Authorization: `Bearer ${token}`,
      },
      mode: 'cors',
      body: JSON.stringify({ category }),
    });

    const data = await response.json();

    if (!response.ok) {
      return { success: false, error: data.error || "Erreur inconnue." };
    }

    return { success: true, message: data.message };
  } catch (err) {
    console.error("Erreur lors de la requête :", err);
    return { success: false, error: "Erreur réseau. Veuillez réessayer." };
  }
};