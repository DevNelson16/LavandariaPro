import { useEffect, useState } from 'react';
 
function App() {
  const [message, setMessage] = useState('A carregar...');

  useEffect(() => {
    fetch('http://localhost:3000')
      .then((response) => response.text())
      .then((data) => setMessage(data))
      .catch(() => setMessage('Erro ao comunicar com o backend.'));
  }, []);

  return (
    <main>
      <h1>LavandariaPro</h1>
      <p>Resposta do servidor: {message}</p>
    </main>
  );
}

export default App;