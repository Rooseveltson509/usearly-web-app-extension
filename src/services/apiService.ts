// apiService.ts

import { Alert } from '../types/Alert';
import { getToken } from '../utils/storageUtil';

const API_URL = 'https://usearly-api.vercel.app/api/v1';

const API_BASE_URL = "https://17d8-2a01-cb08-512-d600-b5e4-a24f-54ce-c58c.ngrok-free.app/api/v1"

export async function callProtectedAPI(endpoint: string) {
  const token = getToken();
  if (!token) throw new Error('Utilisateur non authentifié');

  const response = await fetch(`${API_URL}${endpoint}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) throw new Error('Erreur lors de l’appel de l’API');

  return await response.json();
}

const url = `${API_BASE_URL}/user/alert/new`;


/**
 * Effectue une requête POST pour créer un signalement.
 * @param alertData - Les données du signalement à envoyer au serveur.
 * @param token - Le token d'authentification Bearer.
 * @returns La réponse JSON du serveur ou une erreur si la requête échoue.
 */
export const createAlert = async (
  alertData: Alert,
  token: string
): Promise<any> => {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
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