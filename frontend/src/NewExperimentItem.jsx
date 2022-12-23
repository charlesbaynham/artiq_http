import React from "react";

import Accordion from 'react-bootstrap/Accordion';
import Table from 'react-bootstrap/Table';

function NewExperimentItem(props) {
    const name = props.data.name
    const file = props.data.file
    const class_name = props.data.class_name
    const arg_info = props.data.arg_info

    const table_row = (name, entry) => (
        <tr key={name}>
            <td><b>{name}:</b></td>
            <td>{entry}</td>
        </tr>
    )

    return (
        <Accordion.Item eventKey={class_name}>
            <Accordion.Header>{class_name}</Accordion.Header>
            <Accordion.Body>
                <Table striped bordered hover>
                    <tbody>
                        {table_row("Name", name)}
                        {table_row("Class name", class_name)}
                        {table_row("File", file)}
                        {/* {table_row("Repo rev", repo_rev)}
                        {table_row("Pipeline", pipeline)}
                        {table_row("Status", <em>{status}</em>)} */}
                    </tbody>
                </Table>

                {/* <ButtonGroup className="mt-3">
                    <ScheduleCancelButton rid={rid} />
                    <ScheduleForceCancelButton rid={rid} />
                </ButtonGroup> */}

            </Accordion.Body>
        </Accordion.Item>
    )
}

export default NewExperimentItem;
