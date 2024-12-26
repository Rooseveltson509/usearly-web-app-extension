// apiService.ts

import { Alert } from '../types/Alert';
import { CoupdeCoeur } from '../types/CoupdeCoeur';
import { Suggest } from '../types/Suggest';

const API_BASE_URL = 'https://usearlyapi.fly.dev/api/v1';

export interface ApiResponse {
  success: boolean;
  message: string;
  error?: string;
  status?: number;
  totalReports: number;
  isDuplicate?: boolean; // Indicateur pour les doublons
}

const URL_ALERT = `${API_BASE_URL}/user/alert/new`;
const URL_CDC = `${API_BASE_URL}/user/coupdecoeur/new`;
const URL_SUGGEST = `${API_BASE_URL}/user/suggestion/new`;


/**
 * Effectue une requête POST pour créer une suggestion.
 * @param data - Les données de l'alerte à envoyer au serveur.
 * @param token - Le token d'authentification Bearer.
 * @returns - La réponse JSON du serveur ou une erreur si la requête échoue.
 */
export const createSuggest = async (data: Suggest, token: string): Promise<ApiResponse> => {
  const response = await fetch(URL_SUGGEST, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Origin: window.location.href,
      Authorization: `Bearer ${token}`,
    },
    mode: 'cors',
    body: JSON.stringify(data),
  });

  // Gérer les erreurs HTTP
  if (!response.ok) {
    const errorData: ApiError = await response.json();
    throw errorData; // Lance une erreur avec ApiError
  }

  // Parse la réponse et ajoute le statut HTTP
  const responseData = await response.json();
  return {
    ...responseData,
    status: response.status, // Ajoute le statut HTTP à l'objet renvoyé
  };
};




/**
 * Effectue une requête POST pour créer un coup de coeur.
 * @param data - Les données du coup de coeur à envoyer au serveur.
 * @param token - Le token d'authentification Bearer.
 * @returns La réponse JSON du serveur ou une erreur si la requête échoue.
 * */
export const createCoupdeCoeur = async (data: CoupdeCoeur, token: string): Promise<ApiResponse> => {
  const response = await fetch(URL_CDC, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Origin: window.location.href,
      Authorization: `Bearer ${token}`,
    },
    mode: 'cors',
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData: ApiError = await response.json();
    throw errorData; // Lance une erreur avec ApiError
  }

  // Parse la réponse et ajoute le statut HTTP
  const responseData = await response.json();
  return {
    ...responseData,
    status: response.status, // Ajoute le statut HTTP à l'objet renvoyé
  };

};


/**
 * Effectue une requête POST pour créer un signalement.
 * @param alertData - Les données du signalement à envoyer au serveur.
 * @param token - Le token d'authentification Bearer.
 * @returns La réponse JSON du serveur ou une erreur si la requête échoue.
 */
export const createAlert = async (
  alertData: Alert,
  token: string
): Promise<ApiResponse> => {
  const response = await fetch(URL_ALERT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(alertData),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.error || "Erreur serveur");
  }

  return {
    ...result,
    isDuplicate: result.message?.includes("déjà été signalé"),
  };
};
