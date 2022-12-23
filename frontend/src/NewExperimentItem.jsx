import React from "react";

import Accordion from 'react-bootstrap/Accordion';
import Table from 'react-bootstrap/Table';
import ButtonGroup from 'react-bootstrap/ButtonGroup';

import SubmitNewButton from "./SubmitNewButton";

function NewExperimentItem(props) {
    const name = props.data.name
    const file = props.data.file
    const class_name = props.data.class_name
    const arg_info = props.data.arg_info
    const repo_rev = props.repo_rev

    const table_row = (name, entry) => (
        <tr key={name}>
            <td><b>{name}:</b></td>
            <td>{entry}</td>
        </tr>
    )

    return (
        <Accordion.Item eventKey={class_name}>
            <Accordion.Header>{class_name} &emsp; <em>{file}</em></Accordion.Header>
            <Accordion.Body>
                <Table striped bordered hover>
                    <tbody>
                        {table_row("Name", name)}
                        {table_row("Class name", class_name)}
                        {table_row("File", file)}
                    </tbody>
                </Table>

                <ButtonGroup className="mt-3">
                    <SubmitNewButton file={file} class_name={class_name} repo_rev={repo_rev} />
                </ButtonGroup>

            </Accordion.Body>
        </Accordion.Item>
    )
}

export default NewExperimentItem;
