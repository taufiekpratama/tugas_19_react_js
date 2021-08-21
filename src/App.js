import { Button, Container, Form, Tab, Table } from "react-bootstrap";
import axios from "axios";
import React, { Component } from "react";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataApi: [],
      dataPost: {
        id: 0,
        nama_karyawan: "",
        jabatan: "",
        jenis_kelamin: "",
        tanggal_lahir: "",
      },
      editData: false,
    };
  }

  reloadData = (e) => {
    axios.get("http://localhost:3004/data-karyawan").then((res) => {
      this.setState({
        dataApi: res.data,
        editData: false,
      });
    });
  };

  handleDelete = (e) => {
    fetch(`http://localhost:3004/data-karyawan/${e.target.value}`, {
      method: "DELETE",
    }).then(() => this.reloadData());

  };

  handleGetData = (e) => {
    axios.get(`http://localhost:3004/data-karyawan/${e.target.value}`).then((res) => {
      this.setState({
        dataPost: res.data,
        editData: true
      })
    })
  }

  clearData= () => {
    let dummydataPost = {...this.state.dataPost};
    dummydataPost["id"] = "";
    dummydataPost["nama_karyawan"] = "";
    dummydataPost["jabatan"] = "";
    dummydataPost["jenis_kelamin"] = "";
    dummydataPost["tanggal_lahir"] = "";

    this.setState({
      dataPost: dummydataPost,
    });
  }

  handleInput = (e) => {
    let dummydataPost = { ...this.state.dataPost };
    // Tanpa ini bisa error 404 karna ga bisa put id yang dimaksud
    if(this.state.edit === false) {
      dummydataPost["id"] = new Date().getTime();
    }
    dummydataPost[e.target.name] = e.target.value;
    this.setState(
      {
        dataPost: dummydataPost,
      },
      () => console.log(this.state.dataPost)
    );
  };
  // handle Submit Data
  submitData = () => {
    // Submit bisa error 505 tanpa if else
    if(this.state.editData === false) {
      axios
      .post(`http://localhost:3004/data-karyawan`, this.state.dataPost)
      .then(() => {
        this.reloadData();
        this.clearData();
      });
    }else {
      axios.put(`http://localhost:3004/data-karyawan/${this.state.dataPost.id}`,this.state.dataPost).then(()=>{
        this.reloadData();
        this.clearData();
      })
    }
  };

  componentDidMount() {
    this.reloadData();
  }
  render() {
    return (
      <div>
        <Container>
          <Container className="w-25 border mb-4 mt-4 p-4">
            <Form>
              <Form.Group>
                <Form.Label>Nama Karyawan</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter Nama Karyawan"
                  name="nama_karyawan"
                  onChange={this.handleInput}
                  value={this.state.dataPost.nama_karyawan}
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Jabatan</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter Id"
                  name="jabatan"
                  onChange={this.handleInput}
                  value={this.state.dataPost.jabatan}
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Jenis Kelamin</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter Jenis Kelamin"
                  name="jenis_kelamin"
                  onChange={this.handleInput}
                  value={this.state.dataPost.jenis_kelamin}
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Tanggal Lahir</Form.Label>
                <Form.Control
                  type="date"
                  name="tanggal_lahir"
                  onChange={this.handleInput}
                  value={this.state.dataPost.tanggal_lahir}
                />
              </Form.Group>
              <Form.Group>
                <Button block onClick={this.submitData}>
                  Submit
                </Button>
              </Form.Group>
            </Form>
          </Container>
          <Table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Nama Karyawan</th>
                <th>Jabatan</th>
                <th>Jenis Kelamin</th>
                <th>Tanggal Lahir</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {this.state.dataApi.map((value, index) => {
                return (
                  <tr key={index}>
                    <td>{value.id}</td>
                    <td>{value.nama_karyawan}</td>
                    <td>{value.jabatan}</td>
                    <td>{value.jenis_kelamin}</td>
                    <td>{value.tanggal_lahir}</td>
                    <td>
                      <Button
                        variant="danger"
                        style={{ marginRight: "5px" }}
                        value={value.id}
                        onClick={this.handleDelete}
                      >
                        Delete
                      </Button>
                      <Button
                        value={value.id}
                        onClick={this.handleGetData}
                      >Edit Data</Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </Container>
      </div>
    );
  }
}

export default App;
