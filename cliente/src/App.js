import React, { useState, useEffect } from 'react';
import css from './app.module.css';
import * as api from './services/ApiService';
import Candidates from './components/Candidates';
import { formatNumber } from './helpers/format';

export default function App() {
  const [candidates, setCandidates] = useState([]);
  const [comecou, setComecou] = useState(false);
  const [totalVotes, setTotalVotes] = useState(0);

  useEffect(() => {
    const handleCandidates = (candidates) => {
      return candidates.map((candidate) => {
        const { id } = candidate;
        // prettier-ignore
        const previousCandidate = 
          candidates.find((item) => item.id === id);
        return {
          ...candidate,
          previousVotes: !!previousCandidate ? previousCandidate.votes : 0,
          previousPercentage: !!previousCandidate
            ? previousCandidate.percentage
            : 0,
        };
      });
    };

    const getResultado = async () => {
      const voteData = await api.getVotes();
      setTimeout(async () => {
        const { candidates, totalVotes } = voteData.data;
        const newCandidates = handleCandidates(candidates, totalVotes);
        setCandidates(newCandidates);
        setTotalVotes(totalVotes);
      }, 500);
    };
    if (comecou) {
      getResultado();
    }
  }, [comecou, candidates]);

  const handleButton = () => {
    api.restartVotes();
    setComecou(true);
  };

  return (
    <>
      <header>
        <div className={`navbar-fixed ${css.nav}`}>
          <nav className="teal">
            <div className="navbar-home">
              <div className="content-header">
                <div className={css.divTitulo}>
                  <img
                    className={css.logo}
                    src="logo.jpg" //""
                    alt=""
                    height="80px"
                    width="80px"
                  />
                  <div className={`center ${css.titulo}`}>
                    <h5>Resultado</h5>
                    <h6>Qual a melhor cerveja?</h6>
                  </div>
                </div>
              </div>
            </div>
          </nav>
        </div>
      </header>
      <div className={css.divDivider}></div>
      {!comecou && (
        <div className="center">
          <button
            className="waves-effect waves-light btn-large"
            onClick={handleButton}
          >
            Iniciar apuração
          </button>
        </div>
      )}
      {comecou && (
        <div className="center">
          <h4>
            <b>{`Total de votos apurados ${formatNumber(totalVotes)}`}</b>
          </h4>
          <div className={`container ${css.divVoto}`}>
            <Candidates candidates={candidates} />
          </div>
        </div>
      )}
    </>
  );
}
