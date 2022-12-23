import React from 'react';
import Accordion from 'react-bootstrap/Accordion';

import Table from 'react-bootstrap/Table';

function BasicTable(props) {
    return (
        <Table striped bordered hover>
            {/* <thead>
                <tr>
                    <th>#</th>
                    <th>First Name</th>
                    <th>Last Name</th>
                    <th>Username</th>
                </tr>
            </thead> */}
            <tbody>
                <tr>
                    <td><b>RID:</b></td>
                    <td>{props.rid}</td>
                </tr>
            </tbody>
        </Table>
    );
}


function ScheduleItemNew(props) {
    const rid = props.rid
    const class_name = props.data.expid.class_name
    const file = props.data.expid.file
    const pipeline = props.data.pipeline
    const status = props.data.status
    const repo_rev = props.data.expid.repo_rev
    const args = props.data.expid.arguments

    const table_row = (name, entry) => (
        <tr key={name}>
            <td><b>{name}:</b></td>
            <td>{entry}</td>
        </tr>
    )

    return (
        <Accordion.Item eventKey="0">
            <Accordion.Header><b>({props.rid})</b> &ensp; {props.data.expid.class_name}</Accordion.Header>
            <Accordion.Body>
                <Table striped bordered hover>
                    <tbody>
                        {table_row("RID", rid)}
                        {table_row("Class name", class_name)}
                        {table_row("File", file)}
                        {table_row("Repo rev", repo_rev)}
                        {table_row("Pipeline", pipeline)}
                        {table_row("Status", <em>{status}</em>)}
                    </tbody>
                </Table>

                <Accordion defaultActiveKey="0">
                    <Accordion.Item>
                        <Accordion.Header>
                            Arguments &ensp; <em>(click to expand)</em>
                        </Accordion.Header>
                        <Accordion.Body>
                            <Table striped bordered hover>
                                <tbody>
                                    {
                                        Object.keys(args).map(
                                            (arg_name) => table_row(arg_name, String(args[arg_name]))
                                        )
                                    }
                                </tbody>
                            </Table>
                        </Accordion.Body>
                    </Accordion.Item>
                </Accordion>


            </Accordion.Body>
        </Accordion.Item>
    );
}

export default ScheduleItemNew;
