import React, { useEffect, useCallback, useRef, useState } from "react";
import Axios from "axios";
import Head from "next/head";
import { Modal, Button, Form, Row, InputGroup, Col } from "react-bootstrap";
import { Formik } from "formik";
import * as yup from "yup";

const AUTH_TOKEN =
  "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJiZWFyZXIiLCJzdWIiOjU5MSwiaWF0IjoxNjQ5NDM0NDM2LCJleHAiOjE2NDk0MzgwMzZ9.mGDUvMZKQCLvUhIxWY5YCZ_DBpRxuARGeAAVQMzN3ao";

Axios.defaults.headers.common["Authorization"] = AUTH_TOKEN;
Axios.defaults.headers.post["Content-Type"] =
  "application/x-www-form-urlencoded";

export const getStaticProps = async () => {
  const { data } = await Axios.get("https://hoodwink.medkomtek.net/api/items");

  if (!data) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      data,
    },
  };
};

export default function Home(props) {
  // let isLoggedIn = false;

  const [isLoggedIn, setIsLoggedIn] = useState();
  const [query, setQuery] = useState();
  const [token, setToken] = useState();
  const [results, setResults] = useState([]);
  const [show, setShow] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [isDeleteData, setisDeleteData] = useState();
  const [isModal, setIsModal] = useState();
  const [initialdata, setInitialData] = useState({
    price: "",
    product_name: "",
    qty: "",
    sku: "",
    status: "",
    unit: "",
  });

  const handleClose = () => setShow(false);
  const handleShow = () => {
    setShow(true);
    setInitialData({
      price: "",
      product_name: "",
      qty: "",
      sku: "",
      status: "",
      unit: "",
    });
    setIsModal("add");
  };
  const handleCloseDelete = () => setShowDelete(false);
  const handleShowEdit = (e) => {
    setInitialData({
      price: e.price,
      product_name: e.product_name,
      qty: e.qty,
      sku: e.sku,
      status: e.status,
      unit: e.unit,
    });
    setShow(true);
    setIsModal("edit");
  };
  const handleShowDelete = (e) => {
    setisDeleteData(e);
    setShowDelete(true);
  };

  const schema = yup.object().shape({
    sku: yup.string().required(),
    product_name: yup.string().required(),
    qty: yup.string().required(),
    price: yup.string().required(),
    unit: yup.string().required(),
    status: yup.string().required(),
  });

  // const data = props.data;

  // See https://en.reactjs.org/docs/hooks-effect.html
  useEffect(() => {
    // Run code on client-side only : ensure document is here
    if (typeof document !== undefined) {
      // load JS bootstrap dependency
      let bootstrap = require("bootstrap/dist/js/bootstrap");
    }
    // Run useEffect only once
    if (typeof window !== "undefined") {
      const isToken = localStorage.getItem("token");
      setToken(isToken);
    }

    getData();
  }, []);

  useEffect(() => {
    // console.log(token);
    if (token !== null) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, [token]);

  const getData = async () => {
    try {
      const { data } = await Axios.get(
        "https://hoodwink.medkomtek.net/api/items"
      );
      console.log(data);
      setResults(data);
    } catch (error) {
      console.log(error);
    }
  };
  const searchDataBySKU = useCallback((event) => {
    // console.log(event);
    const query = event.target.value;
    setQuery(query);
    if (query.length) {
      try {
        searchEndpoint(query);
      } catch (error) {
        console.log(error);
      }
    } else {
      getData();
    }
  });

  const searchEndpoint = async (query) => {
    const url = `https://hoodwink.medkomtek.net/api/item/search`;

    const form = new FormData();
    form.append("sku", query);

    try {
      const { data } = await Axios.post(url, form);
      setResults([data]);
    } catch (error) {
      console.log(error);
    }
  };

  const editData = async (values) => {
    const url = `https://hoodwink.medkomtek.net/api/item/update`;

    const form = new FormData();
    form.append("sku", values.sku);
    form.append("product_name", values.product_name);
    form.append("qty", values.qty);
    form.append("price", values.price);
    form.append("unit", values.unit);
    form.append("status", values.status);

    try {
      const { data } = await Axios.post(url, form);
      console.log(data);
      handleClose();
      getData();
    } catch (error) {
      console.log(error);
    }
  };

  const addProduct = async (values) => {
    const url = `https://hoodwink.medkomtek.net/api/item/add`;

    const form = new FormData();
    form.append("sku", values.sku);
    form.append("product_name", values.product_name);
    form.append("qty", values.qty);
    form.append("price", values.price);
    form.append("unit", values.unit);
    form.append("status", values.status);

    try {
      const { data } = await Axios.post(url, form);
      console.log(data);
      handleClose();
      getData();
    } catch (error) {
      console.log(error);
    }
  };

  const deleteData = async () => {
    const url = `https://hoodwink.medkomtek.net/api/item/delete`;
    const form = new FormData();
    form.append("sku", isDeleteData);
    try {
      const { data } = await Axios.post(url, form);
      console.log(data);
      handleCloseDelete();
      getData();
    } catch (error) {
      console.log(error);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
  };

  return (
    <div>
      <Head>
        <title>Next and Bootstrap</title>
        <meta
          name="description"
          content="A demo about NextJS and Bootstrap 5"
        />
      </Head>

      <Modal show={showDelete} onHide={handleCloseDelete}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmation for Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure want to Delete this data SKU {isDeleteData}?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseDelete}>
            Close
          </Button>
          <Button variant="danger" onClick={deleteData}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>
            {isModal == "edit" ? "Edit Product" : "Add Product"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Formik
            validationSchema={schema}
            onSubmit={(values) => {
              // same shape as initial values
              isModal == "edit" ? editData(values) : addProduct(values);
            }}
            initialValues={initialdata}
          >
            {({
              handleSubmit,
              handleChange,
              handleBlur,
              values,
              touched,
              isValid,
              errors,
            }) => (
              <Form noValidate onSubmit={handleSubmit}>
                <Row className="mb-3">
                  <Form.Group as={Col} md="4" controlId="validationFormik01">
                    <Form.Label>SKU</Form.Label>
                    <InputGroup hasValidation>
                      <Form.Control
                        type="text"
                        placeholder="SKU"
                        name="sku"
                        aria-describedby="inputGroupPrepend"
                        value={values.sku}
                        onChange={handleChange}
                        isInvalid={!!errors.sku}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.sku}
                      </Form.Control.Feedback>
                    </InputGroup>
                  </Form.Group>
                  <Form.Group as={Col} md="4" controlId="validationFormik02">
                    <Form.Label>Product Name</Form.Label>
                    <InputGroup hasValidation>
                      <Form.Control
                        type="text"
                        placeholder="Product Name"
                        name="product_name"
                        aria-describedby="inputGroupPrepend"
                        value={values.product_name}
                        onChange={handleChange}
                        isInvalid={!!errors.product_name}
                      />

                      <Form.Control.Feedback type="invalid">
                        {errors.product_name}
                      </Form.Control.Feedback>
                    </InputGroup>
                  </Form.Group>
                  <Form.Group
                    as={Col}
                    md="4"
                    controlId="validationFormikUsername"
                  >
                    <Form.Label>Qty</Form.Label>
                    <InputGroup hasValidation>
                      <Form.Control
                        type="text"
                        placeholder="Qty"
                        aria-describedby="inputGroupPrepend"
                        name="qty"
                        value={values.qty}
                        onChange={handleChange}
                        isInvalid={!!errors.qty}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.qty}
                      </Form.Control.Feedback>
                    </InputGroup>
                  </Form.Group>
                </Row>
                <Row className="mb-3">
                  <Form.Group as={Col} md="6" controlId="validationFormik03">
                    <Form.Label>Price</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Price"
                      name="price"
                      value={values.price}
                      onChange={handleChange}
                      isInvalid={!!errors.price}
                    />

                    <Form.Control.Feedback type="invalid">
                      {errors.price}
                    </Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group as={Col} md="3" controlId="validationFormik04">
                    <Form.Label>Unit</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Unit"
                      name="unit"
                      value={values.unit}
                      onChange={handleChange}
                      isInvalid={!!errors.unit}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.unit}
                    </Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group as={Col} md="3" controlId="validationFormik05">
                    <Form.Label>Status</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Status"
                      name="status"
                      value={values.status}
                      onChange={handleChange}
                      isInvalid={!!errors.status}
                    />

                    <Form.Control.Feedback type="invalid">
                      {errors.status}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Row>
                <Button type="submit">
                  {isModal == "edit" ? "Edit" : "Add"}
                </Button>
              </Form>
            )}
          </Formik>
        </Modal.Body>
      </Modal>

      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container-fluid">
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarTogglerDemo03"
            aria-controls="navbarTogglerDemo03"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <a className="navbar-brand" href="#">
            Stock
          </a>
          <div className="collapse navbar-collapse" id="navbarTogglerDemo03">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <a className="nav-link active" aria-current="page" href="#">
                  Home
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="/register">
                  Register
                </a>
              </li>
              <li className="nav-item">
                <a
                  className="nav-link"
                  href="/login"
                  onClick={() => (isLoggedIn ? logout() : null)}
                >
                  {isLoggedIn ? "Logout" : "Login"}
                </a>
              </li>
            </ul>
          </div>
        </div>
      </nav>
      {isLoggedIn ? (
        <main>
          <section className="py-5 text-center container">
            <div className="d-grid gap-2 d-md-flex justify-content-md-start">
              <div className="d-flex">
                <input
                  className="form-control me-2"
                  type="search"
                  placeholder="Search By SKU"
                  aria-label="Search"
                  onChange={(e) => searchDataBySKU(e)}
                ></input>
                {/* <button className="btn btn-outline-success" type="submit" onClick={searchDataBySKU}>Search</button> */}
              </div>
            </div>
            <div className="d-grid gap-2 d-md-flex justify-content-md-end">
              <button
                className="btn btn-primary"
                type="button"
                // onClick={addProduct()}
                onClick={handleShow}
              >
                Add Product
              </button>
            </div>
            <table className="table">
              <thead>
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">SKU</th>
                  <th scope="col">Product Name</th>
                  <th scope="col">Qty</th>
                  <th scope="col">Price</th>
                  <th scope="col">Unit</th>
                  <th scope="col">Action</th>
                </tr>
              </thead>
              <tbody>
                {results?.map((item, index) => (
                  <tr key={index}>
                    <th scope="row" key={index}>
                      {item.message ? null : index + 1}
                    </th>
                    <td>{item.sku}</td>
                    <td>{item.product_name}</td>
                    <td>{item.qty}</td>
                    <td>{item.price}</td>
                    <td>{item.unit}</td>
                    <td className="btn-group" role="group">
                      {item.message ? null : (
                        <button
                          className="btn btn-outline-success"
                          onClick={() => handleShowEdit(item)}
                        >
                          Edit
                        </button>
                      )}
                      {item.message ? null : (
                        <button
                          className="btn btn-outline-danger"
                          onClick={() => handleShowDelete(item.sku)}
                        >
                          Delete
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        </main>
      ) : (
        <main>
          <section className="py-5 text-center container">
            <div className="row py-lg-5">
              <div className="col-lg-6 col-md-8 mx-auto">
                <h1 className="fw-light">Please login,</h1>
                <h2 className="fw-light">
                  this page only can access when login.
                </h2>
                <p className="lead text-muted">Hello World.</p>
              </div>
            </div>
          </section>
        </main>
      )}
    </div>
  );
}
