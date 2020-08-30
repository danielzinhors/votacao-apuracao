import axios from 'axios';

const API_URL = 'http://localhost:8080/vote';
async function getVotes() {
  const res = await axios.get(`${API_URL}`);
  return res;
}

async function restartVotes() {
  return await axios.post(`${API_URL}/restart`);
}

export { getVotes, restartVotes };
