import { useState, useEffect } from "react";
import { Button, Form } from "react-bootstrap";
import React from 'react';
import api from "./api";

//Agrega la pelicula
const AddMovie = ({ onAdd }) => {
  const [name, setName] = useState("");
  const [genre, setGenre] = useState("");
  const [starring, setStarring] = useState("");
  const [movieId, setMovieId] = useState(null);
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    refreshMovies();
  }, []);

  const refreshMovies = () => {
    api.get("/")
      .then((res) => {
        setMovies(res.data);
      })
      .catch(console.error);
  };

  //Envia peliculas nueva
  const onSubmit = (e) => {
    e.preventDefault();
    if (!name || !genre || !starring) {
      alert("Por favor completa todos los campos obligatorios");
      return;
    }
    let item = { name, genre, starring };
    api.post("/", item)
    .then(() => {
      // Limpiar los campos después de enviar la solicitud
      setName("");
      setGenre("");
      setStarring("");
      refreshMovies();
    });
};

//Editar peliculas que ya tengo registradas

const onUpdate = (id) => {
  // Mostrar un mensaje de confirmación
  const confirmUpdate = window.confirm("¿Estás seguro que deseas editar esta película?");
  if (!confirmUpdate) {
    return; 
  }
  let item = { name, genre, starring };
  api.patch(`/${id}/`, item)
    .then((res) => {
      // Limpiar los campos
      setName("");
      setGenre("");
      setStarring("");
      refreshMovies();
    });
};

//Eliminar Peliculas
const onDelete = (id) => {
  const confirmDelete = window.confirm("¿Estás seguro que deseas eliminar esta película?");
  if (!confirmDelete) {
    return; 
  }
  api.delete(`/${id}/`).then((res) => refreshMovies());
};

  function selectMovie(id) {
    let item = movies.filter((movie) => movie.id === id)[0];
    setName(item.name);
    setGenre(item.genre);
    setStarring(item.starring);
    setMovieId(item.id);
  }
  return (
    //Formulario para la vista del usuario.
    <div className="container mt-5">
      <div className="row">
        <div className="col-md-4">
          <h3 className="float-left">Ingresa Una Película</h3> 

  <Form onSubmit={onSubmit} className="mt-4">
  <Form.Group className="mb-3" controlId="formBasicName">
    <Form.Label>Nombre</Form.Label>
    <Form.Control
      type="text"
      placeholder="Ingresa el nombre de la película"
      value={name}
      onChange={(e) => setName(e.target.value)}
    />
  </Form.Group>

  <Form.Group className="mb-3" controlId="formBasicGenre">
    <Form.Label>Género</Form.Label>
    <Form.Control
      type="text"
      placeholder="Género al que pertenece"
      value={genre}
      onChange={(e) => setGenre(e.target.value)}
    />
  </Form.Group>

  <Form.Group className="mb-3" controlId="formBasicStarring">
    <Form.Label>Protagonistas</Form.Label>
    <Form.Control
      type="text"
      placeholder="Ingresa los protagonistas"
      value={starring}
      onChange={(e) => setStarring(e.target.value)}
    />
  </Form.Group>

  <div className="float-right">
    <Button
      variant="primary"
      type="submit"
      onClick={onSubmit}
      className="mx-2"
    >
      Ingresar
    </Button>
    <Button
      variant="primary"
      type="button"
      onClick={() => onUpdate(movieId)}
      className="mx-2"
    >
      Editar
    </Button>
  </div>
</Form>
        </div>
        <div className="col-md-8 m">
          <table className="table">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Nombre de la Película</th>
                <th scope="col">Genero</th>
                <th scope="col">Protagonistas</th>
                <th scope="col"></th>
              </tr>
            </thead>
            <tbody>
              {movies.map((movie, index) => {
                return (
                  <tr key={movie.id}>
                    <th scope="row">{movie.id}</th>
                    <td> {movie.name}</td>
                    <td>{movie.genre}</td>
                    <td>{movie.starring}</td>
                    <td>
                       <button
                        className="material-icons btn btn-primary"
                        onClick={() => selectMovie(movie.id)}
                      >
                        Editar
                      </button>
                      <button
                        className="material-icons btn btn-danger mx-3"
                        onClick={() => onDelete(movie.id)}
                      >Eliminar
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AddMovie;