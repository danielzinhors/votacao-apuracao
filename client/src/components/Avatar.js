import React from 'react';
import css from './avatar.module.css';

/**
 * Functional Component para montar uma imagem
 * em tela. Foi definida uma imagem arredondada e
 * tamanho fixo de 100px. O formato circular foi
 * feito com o apoio de classNames do Materialize
 * CSS (item e circle)
 */
export default function Avatar({ imageURL, name }) {
  return (
    <img
      src={imageURL}
      className={css.logo}
      width="100px"
      height="100px"
      alt={name}
    />
  );
}
