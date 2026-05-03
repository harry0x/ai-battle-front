import api from "../lib/axios.js";

/**
 * Fetch paginated list of user's chats.
 * @param {number} page
 * @param {number} limit
 * @returns {Promise<{chats: object[], total: number, page: number, hasMore: boolean}>}
 */
export async function getChatsApi(page = 1, limit = 20) {
  const { data } = await api.get("/chats", { params: { page, limit } });
  return data.data;
}

/**
 * Create a new chat.
 * @param {string} [title]
 * @returns {Promise<{chat: object}>}
 */
export async function createChatApi(title) {
  const { data } = await api.post("/chats", { title });
  return data.data;
}

/**
 * Get a single chat by ID.
 * @param {string} chatId
 * @returns {Promise<{chat: object}>}
 */
export async function getChatApi(chatId) {
  const { data } = await api.get(`/chats/${chatId}`);
  return data.data;
}

/**
 * Soft delete a chat.
 * @param {string} chatId
 * @returns {Promise<void>}
 */
export async function deleteChatApi(chatId) {
  await api.delete(`/chats/${chatId}`);
}

/**
 * Update a chat's title.
 * @param {string} chatId
 * @param {string} title
 * @returns {Promise<{chat: object}>}
 */
export async function updateChatTitleApi(chatId, title) {
  const { data } = await api.patch(`/chats/${chatId}`, { title });
  return data.data;
}

/**
 * Fetch paginated messages for a chat (cursor-based).
 * @param {string} chatId
 * @param {string} [cursor]
 * @param {number} [limit]
 * @returns {Promise<{messages: object[], hasMore: boolean, nextCursor: string|null}>}
 */
export async function getMessagesApi(chatId, cursor, limit = 20) {
  const params = { limit };
  if (cursor) params.cursor = cursor;
  const { data } = await api.get(`/chats/${chatId}/messages`, { params });
  return data.data;
}

/**
 * Stream a message to a chat using Server-Sent Events.
 * @param {string} chatId
 * @param {string} content
 * @param {function} onEvent - Callback for SSE events
 * @returns {Promise<void>}
 */
export async function streamMessageApi(chatId, content, onEvent) {
  const { getAccessToken } = await import("../lib/axios.js");
  const token = getAccessToken();
  
  const response = await fetch(`${api.defaults.baseURL}/chats/${chatId}/messages`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    },
    credentials: "include",
    body: JSON.stringify({ content })
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    
    let boundary = buffer.indexOf("\n\n");
    while (boundary !== -1) {
      const chunk = buffer.slice(0, boundary);
      buffer = buffer.slice(boundary + 2);
      
      if (chunk.startsWith("data: ")) {
        try {
          const data = JSON.parse(chunk.slice(6));
          onEvent(data);
        } catch (e) {
          console.error("Error parsing SSE JSON:", e);
        }
      }
      
      boundary = buffer.indexOf("\n\n");
    }
  }
}

/**
 * Stream a message to a guest chat using Server-Sent Events.
 * @param {string} content
 * @param {function} onEvent - Callback for SSE events
 * @returns {Promise<void>}
 */
export async function streamGuestMessageApi(content, onEvent) {
  const response = await fetch(`${api.defaults.baseURL}/chats/guest/stream`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ content })
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    
    let boundary = buffer.indexOf("\n\n");
    while (boundary !== -1) {
      const chunk = buffer.slice(0, boundary);
      buffer = buffer.slice(boundary + 2);
      
      if (chunk.startsWith("data: ")) {
        try {
          const data = JSON.parse(chunk.slice(6));
          onEvent(data);
        } catch (e) {
          console.error("Error parsing SSE JSON:", e);
        }
      }
      
      boundary = buffer.indexOf("\n\n");
    }
  }
}
