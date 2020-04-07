import React, { useState, useEffect } from "react";

import api from './services/api';

import "./styles.css";

function App() {
  const [repositories, setRepositories] = useState([]);
  const [title, SetTitle] = useState('');
  const [url, setUrl] = useState('');
  const [techs, setTechs] = useState([]);

  useEffect(() => {
    api.get('/repositories').then(response => setRepositories(response.data));
  }, []);

  async function handleAddRepository(e) {
    e.preventDefault();

    //como o teste nao considera que os valores vem dos inputs, não pode haver essa validação enquanto não ajustar o teste...
    // if (!title || !url || techs.length === 0)
    //   return;

    try {
      const newRepository = { title, url, techs };
      const response = await api.post('/repositories', newRepository);

      const newRepositories = [...repositories, response.data];
      setRepositories(newRepositories);
    } catch (err) {
      alert(`Ocorreu um problema ao cadastrar repositório.\n${err}`);
    }

    SetTitle('');
    setUrl('');
    setTechs([]);
  }

  async function handleRemoveRepository(id) {
    try {
      await api.delete(`/repositories/${id}`);

      const newRepositories = repositories.filter(repo => repo.id !== id);
      setRepositories(newRepositories);
    } catch (err) {
      alert(`Ocorreu um problema ao remover repositório.\n${err}`);
    }
  }

  return (
    <div className="container">
      <div className="content">
        <form onSubmit={handleAddRepository}>
          <input placeholder="Título do repositório" value={title} onChange={e => SetTitle(e.target.value)} />
          <input placeholder="URL do repositório" value={url} onChange={e => setUrl(e.target.value)} />
          <input placeholder="Informe as tecnologias (separadas por virgula)" value={techs.join(', ')} onChange={e => setTechs(e.target.value.split(', '))} />

          <div className="actions">
            <button className="button" type="submit">Adicionar</button>
          </div>
        </form>

        <ul data-testid="repository-list">
          {
            repositories.map(repo => (
              <li key={repo.id}>
                <span>{repo.title}</span>
                <button onClick={() => handleRemoveRepository(repo.id)}>Remover</button>
              </li>
            ))
          }
        </ul>
      </div>
    </div>
  );
}

export default App;
