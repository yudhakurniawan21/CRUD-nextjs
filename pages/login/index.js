import React, { useState } from "react";
import { useRouter } from 'next/router';
import Axios from "axios";
import Head from "next/head";
import { Formik } from "formik";
import { Modal, Button, Form, Row, InputGroup, Col } from "react-bootstrap";
import * as yup from "yup";

Axios.defaults.headers.post["Content-Type"] =
    "application/x-www-form-urlencoded";

export default function Login() {

    const router = useRouter()
    const [error, setError] = useState(false);
    const [success, setSuccess] = useState(false);


    const [initialdata, setInitialData] = useState({
        password: "",
        email: "",

    });

    const schema = yup.object().shape({
        email: yup.string().email('Invalid email').required(),
        password: yup.string().required(),

    });

    const login = async (values) => {
        const url = `https://hoodwink.medkomtek.net/api/auth/login`;

        const form = new FormData();
        form.append("email", values.email);
        form.append("password", values.password);

        try {
            const { data } = await Axios.post(url, form);
            console.log(data);
            localStorage.setItem("token", data.token)
            setSuccess(true);
            setError(false);
            router.push("/");
        } catch (error) {
            console.log(error.response.data.error);
            setError(error.response.data.error);
            setSuccess(false);
        }
    }

    return (
        <div>
            <Head>
                <title>Next and Bootstrap</title>
                <meta
                    name="description"
                    content="A demo about NextJS and Bootstrap 5"
                />
            </Head>
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
                                <a className="nav-link" aria-current="page" href="/">
                                    Home
                                </a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="/register">
                                    Register
                                </a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link active" href="/login">
                                    Login
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
            <main>
                <div className="container">
                    <div className="row">
                        <div className="col-sm-9 col-md-7 col-lg-5 mx-auto">
                            <div className="card border-0 shadow rounded-3 my-5">
                                <div className="card-body p-4 p-sm-5">
                                    <h5 className="card-title text-center mb-5 fw-light fs-5">Login</h5>
                                    <Formik
                                        validationSchema={schema}
                                        onSubmit={(values) => {
                                            // same shape as initial values
                                            login(values);
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
                                                    <Form.Group as={Col} md="12" controlId="validationFormik01">
                                                        <Form.Label>Email</Form.Label>
                                                        <InputGroup hasValidation>
                                                            <Form.Control
                                                                type="email"
                                                                placeholder="example@gmail.com"
                                                                name="email"
                                                                aria-describedby="inputGroupPrepend"
                                                                value={values.email}
                                                                onChange={handleChange}
                                                                isInvalid={!!errors.email}
                                                            />
                                                            <Form.Control.Feedback type="invalid">
                                                                {errors.email}
                                                            </Form.Control.Feedback>
                                                        </InputGroup>
                                                    </Form.Group>
                                                </Row>
                                                <Row className="mb-3">
                                                    <Form.Group as={Col} md="12" controlId="validationFormik02">
                                                        <Form.Label>Password</Form.Label>
                                                        <InputGroup hasValidation>
                                                            <Form.Control
                                                                type="password"
                                                                placeholder="********"
                                                                name="password"
                                                                aria-describedby="inputGroupPrepend"
                                                                value={values.password}
                                                                onChange={handleChange}
                                                                isInvalid={!!errors.password}
                                                            />

                                                            <Form.Control.Feedback type="invalid">
                                                                {errors.password}
                                                            </Form.Control.Feedback>
                                                        </InputGroup>
                                                    </Form.Group>
                                                </Row>
                                                {error && !success ?
                                                    <div role="alert" className="alert alert-danger mb-3"><small className="text-muted">{error}</small></div> :
                                                    success && !error ?
                                                        <div role="alert" className="alert alert-success mb-3"><small className="text-muted">Success Login!</small></div> : null
                                                }
                                                <Button type="submit">
                                                    Sign in
                                                </Button>
                                            </Form>
                                        )}
                                    </Formik>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}