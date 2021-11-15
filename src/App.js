import React, { Component } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import Container from 'react-bootstrap/Container';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form'


class App extends Component {
  constructor(props) {
    super(props);
    this.state=({
      prestamos:[],
      pos:null,
      titulo:'Nuevo',
      id:0,
      libro:0,
      usuario:0,
      fecprestamo:'',
      fecdevolucion:''
    })
    this.cambioLibro=this.cambioLibro.bind(this);
    this.cambioUsuario=this.cambioUsuario.bind(this);
    this.cambioFecPrestamo=this.cambioFecPrestamo.bind(this);
    this.cambioFecDevolucion=this.cambioFecDevolucion.bind(this);
    this.mostrar=this.mostrar.bind(this);
    this.eliminar=this.eliminar.bind(this)
    this.guardar=this.guardar.bind(this)
    
  }
  componentDidMount(){
    axios.get('http://127.0.0.1:8000/prestamos/')
    .then(res=> {
      this.setState({prestamos:res.data})
    })
  }

  cambioLibro(e){
    this.setState({
      libro : e.target.value
    })
  }
  cambioUsuario(e){
    this.setState({
      usuario:e.target.value
    })
  }
  cambioFecPrestamo(e){
    this.setState({
      fecprestamo : e.target.value
    })
  }
  cambioFecDevolucion(e){
    this.setState({
      fecdevolucion : e.target.value
    })
  }
  mostrar(cod,index){
    axios.get('http://127.0.0.1:8000/prestamos/'+cod)
    .then(res => {
      this.setState({
        pos: index,
        titulo: 'Editar',
        id: res.data.id,
        libro :res.data.libro,
        usuario: res.data.usuario,
        fecprestamo: res.data.fecprestamo,
        fecdevolucion : res.data.fecdevolucion
      })
    })
  }
  guardar(e){
    e.preventDefault();
    let cod = this.state.id;
    const datos = {
      libro: this.state.libro,
      usuario: this.state.usuario,
      fecprestamo: this.state.fecprestamo,
      fecdevolucion: this.state.fecdevolucion
    }
    if(cod>0){
      //edición de un registro
      axios.put('http://127.0.0.1:8000/prestamos/'+cod,datos)
      .then(res =>{
        let indx = this.state.pos;
        this.state.prestamos[indx] = res.data;
        var temp = this.state.prestamos;
        this.setState({
          pos:null,
          titulo:'Nuevo',
          id:0,
          libro:0,
          usuario:0,
          fecprestamo:'',
          fecdevolucion:'',
          prestamos: temp
        });
      }).catch((error) =>{
        console.log(error.toString());
      });
    }else{
      //nuevo registro
      axios.post('http://127.0.0.1:8000/prestamos/',datos)
      .then(res => {
        this.state.prestamos.push(res.data);
        var temp = this.state.prestamos;
        this.setState({
          id:0,
          libro:0,
          usuario: 0,
          fecprestamo:'',
          fecdevolucion:'',
          prestamos:temp
        });
      }).catch((error)=>{
        console.log(error.toString());
      });
    }
  }
  eliminar(cod){
    let rpta = window.confirm("Desea Eliminar?");
    if(rpta){
      axios.delete('http://127.0.0.1:8000/prestamos/'+cod)
      .then(res =>{
        var temp = this.state.prestamos.filter((prestamo)=>prestamo.id !== cod);
        this.setState({
          prestamos: temp
        })
      })
    }
  }
  render() {
    return (
      <div>
        <Container>
            <Table striped bordered hover variant="dark">
            <thead>
              <tr>
                <th>ID Libro</th>
                <th>ID Usuario</th>
                <th>Fecha Prestamo</th>
                <th>Fecha Devolucion</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {this.state.prestamos.map((prestamo,index) =>{
                return (
                  <tr key={prestamo.id}>
                    <td>{prestamo.libro}</td>
                    <td>{prestamo.usuario}</td>
                    <td>{prestamo.fecprestamo}</td>
                    <td>{prestamo.fecdevolucion}</td>
                    <td>
                    <Button variant="success" 
  onClick={()=>this.mostrar(prestamo.id,index)}>Editar</Button>
                    <Button variant="danger" 
  onClick={()=>this.eliminar(prestamo.id,index)}>Eliminar</Button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </Table>
          <hr />
          <h1>{this.state.titulo}</h1>
          <Form onSubmit={this.guardar}>
              <input type="hidden" value={this.state.id} />
              <Form.Group className="mb-3">
                <Form.Label>ID Libro</Form.Label>
                <Form.Control type="number" value={this.state.libro} 
  onChange={this.cambioLibro} />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>ID Usuario</Form.Label>
                <Form.Control type="number" value={this.state.usuario} 
  onChange={this.cambioUsuario} />
              </Form.Group>
              <Form.Group className="mb-3">                                                                                                                                     Pág. 7    
                <Form.Label>Fecha de Prestamo</Form.Label>
                <Form.Control type="date" value={this.state.fecprestamo} 
  onChange={this.cambioFecPrestamo} />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Fecha Devolucion</Form.Label>
                <Form.Control type="date" value={this.state.fecdevolucion} 
  onChange={this.cambioFecDevolucion} />
              </Form.Group>
              <Button variant="primary" type="submit">
                Guardar
              </Button>
          </Form>
        </Container>
      </div>)
    }
  }

export default App;
