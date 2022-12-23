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
    console.log(props.data)

    return (
        <Accordion.Item eventKey="0">
            <Accordion.Header><b>({props.rid})</b> {props.data.expid.class_name}</Accordion.Header>
            <Accordion.Body>
                <Table striped bordered hover>
                    <tbody>
                        <tr>
                            <td><b>RID:</b></td>
                            <td>{props.rid}</td>
                        </tr>
                        <tr>
                            <td><b>Class name:</b></td>
                            <td>{props.data.expid.class_name}</td>
                        </tr>
                        <tr>
                            <td><b>File:</b></td>
                            <td>{props.data.expid.file}</td>
                        </tr>
                        <tr>
                            <td><b>Repo rev:</b></td>
                            <td>{props.data.expid.repo_rev}</td>
                        </tr>
                        <tr>
                            <td><b>Pipeline:</b></td>
                            <td>{props.data.pipeline}</td>
                        </tr>
                        <tr>
                            <td><b>Status:</b></td>
                            <td><em>{props.data.status}</em></td>
                        </tr>
                    </tbody>
                </Table>

                <Accordion defaultActiveKey="0">
                    <Accordion.Item>
                        <Accordion.Header>
                            Arguments <em>(click to expand)</em>
                        </Accordion.Header>
                        <Accordion.Body>
                            Hello
                        </Accordion.Body>
                    </Accordion.Item>
                </Accordion>


            </Accordion.Body>
        </Accordion.Item>
    );
}

export default ScheduleItemNew;
