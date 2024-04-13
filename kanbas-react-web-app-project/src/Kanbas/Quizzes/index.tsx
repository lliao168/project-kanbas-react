import React, { useState, useEffect } from 'react';
import { FaCheckCircle, FaEllipsisV } from "react-icons/fa";
import { Link, useParams, useNavigate} from "react-router-dom";
import { assignments } from '../Database';
import { FaCaretDown, FaPlus } from "react-icons/fa6";
import { HiOutlinePencilSquare } from "react-icons/hi2";
import { PiDotsSixVerticalBold } from "react-icons/pi";
import { useSelector, useDispatch } from "react-redux";
import { KanbasState } from '../store';
import { Modal, Button} from 'react-bootstrap';
import { RxRocket } from "react-icons/rx";
import { RiProhibitedLine } from "react-icons/ri";

import {
    addAssignment,
    deleteAssignment,
    updateAssignment,
    selectAssignment,
  } from "../Courses/Assignments/assignmentsReducer";

import * as client from "../Courses/Assignments/client";  

import { findAssignmentsForCourse, createAssignment } from "../Courses/Assignments/client";

function determineQuizAvailability(availableFrom : any, availableUntil : any) {
    const currentDate = new Date();
    const availableFromDate = new Date(availableFrom);
    const availableUntilDate = new Date(availableUntil);

    if (currentDate < availableFromDate) {
        return `Not available until ${availableFromDate.toLocaleDateString()}`;
    } else if (currentDate >= availableFromDate && currentDate <= availableUntilDate) {
        return "Available";
    } else {
        return "Closed";
    }
}

function formatDate(dateString : any) {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
        month: 'short', 
        day: '2-digit', 
        hour: 'numeric', 
        minute: '2-digit', 
        hour12: true 
    };

    const formatter = new Intl.DateTimeFormat('en-US', options);
    return formatter.format(date);
}

function Quizzes () {
    const { courseId } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        findAssignmentsForCourse(courseId)
          .then((assignments) =>
            dispatch(selectAssignment(assignments))
        );
      }, [courseId]);   
    const assignmentList = useSelector((state: KanbasState) => state.assignmentsReducer.assignments);
    interface Assignment {
        _id: string;
        title: string;
        course: string;
        category: string;
        description: string;
        isPublished: boolean;
    }
    
    const handleSelectAssignment = (assignment: Assignment) => {
        dispatch(selectAssignment(assignment));
        navigate(`/Kanbas/Courses/${courseId}/Assignments/${assignment._id}`);
    };

    interface ContextMenuElement {
        x: number;
        y: number;
        onEdit: () => void;
        onDelete: () => void;
        onPublish: () => void;
        onCopy: () => void;
        onSort: () => void;
    }

    // const [contextMenu, setContextMenu] = useState({visible: false, x:0, y:0, assignmentId: null, selectedAssignment: null});

    const [contextMenu, setContextMenu] = useState<{
        visible: boolean;
        x: number;
        y: number;
        assignmentId: string | null;
        selectedAssignment: Assignment | null;  
    }>({
        visible: false,
        x: 0,
        y: 0,
        assignmentId: null,
        selectedAssignment: null,
    });

    const handleContextMenu = (event : any, assignment : any) => {
        event.preventDefault();
        if (contextMenu.visible && contextMenu.assignmentId === assignment._id) {
            setContextMenu({...contextMenu, visible: false});
        } else {
            setContextMenu(
                {
                    visible: true,
                    x: event.clientX,
                    y: event.clientY,
                    assignmentId: assignment._id,
                    selectedAssignment: assignment
                }
            );
        }
    };

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedAssignmentId, setSelectedAssignmentId] = useState<Assignment | null>(null);

    const handleShowDeleteModal = (assignmentId: Assignment | null) => {
        if (assignmentId) {
            const assignment = assignmentList.find(a => a._id === assignmentId);
            if(assignment) {
                setSelectedAssignmentId(assignment);
                setShowDeleteModal(true);
            }
        } 
    };

    const handleCloseDeleteModal = (e?: any) => {   // e is optional and if provided can be of any type
        if (e) e.stopPropagation();
        setSelectedAssignmentId(null);
        setShowDeleteModal(false);
    };

    const handleDeleteAssignment = () => {
        // e.stopPropagation();
        if (selectedAssignmentId) {
            client.deleteAssignment(selectedAssignmentId._id).then((status) => {
                dispatch(deleteAssignment(selectedAssignmentId._id));
            });
            handleCloseDeleteModal();
        }
    };

    const handlePublish = (assignmentId : Assignment | null) => {
        if (!assignmentId) return;
        const assignment = assignmentList.find(a => a._id === assignmentId);
        if (assignment) {
            const updatedAssignment = {...assignment, isPublished: !assignment.isPublished};
            client.updateAssignment(updatedAssignment).then(() => {  
                dispatch(updateAssignment(updatedAssignment));
                
                setContextMenu({...contextMenu, visible: false});
            })
        }
    };

    const handleUnpublish = (assignmentId : Assignment | null) => {
        const updatedAssignments = assignmentList.map(assignment => {
            if (assignment._id === assignmentId) {
                return { ...assignment, isPublished: false };
            }
            return assignment;
        });
        dispatch(updateAssignment(updatedAssignments));  
    };

    const handleMenu = (action : any, assignmentId : any) => {
        switch (action) {
            case 'edit':
                break;
            case 'delete':
                break;
            case 'publish':
                break;
            default:
                break;            
        }
        setContextMenu({...contextMenu, visible: false});
    };

    const renderContextMenu = () => {
        if (!contextMenu.visible) return null;

        return (
            <ul className="list-group" style={{top: `${contextMenu.y}px`, left: `${contextMenu.x}px`, position:"fixed", zIndex:"1000", border:"1px solid #ccc", width:"60px", borderRadius: "5px"}}>
                <li className="list-group-item" style={{borderBottom: "1px solid #ccc", backgroundColor:"#f0f0f0"}}>
                    <button type="button"onClick={() => navigate(`/Kanbas/Courses/${courseId}/Quizzes/${contextMenu.selectedAssignment}`)}>
                        Edit
                    </button>
                </li>
                <li className="list-group-item" style={{borderBottom: "1px solid #ccc", backgroundColor:"#f0f0f0"}}>
                    <button type="button" onClick={(event) => {
                        event.stopPropagation();
                        if (contextMenu.selectedAssignment && contextMenu.selectedAssignment) {
                            handleShowDeleteModal(contextMenu.selectedAssignment);
                        }
                    }}>
                        Delete
                    </button>
                    <Modal show={showDeleteModal} onHide={handleCloseDeleteModal} aria-labelledby="contained-modal-title-vcenter" centered>
                                    <Modal.Header closeButton>
                                        <Modal.Title >Confirm Delete</Modal.Title>
                                    </Modal.Header>
                                    <Modal.Body>Are you sure you want to remove this assignment?</Modal.Body>
                                    <Modal.Footer>
                                        <Button variant="primary" 
                                        onClick={
                                            handleDeleteAssignment
                                        }
                                        >
                                            Yes
                                        </Button>
                                        <Button variant="secondary" 
                                        onClick={handleCloseDeleteModal}>
                                            No
                                        </Button>
                                    </Modal.Footer>
                    </Modal>
                </li>
                <li className="list-group-item" style={{borderBottom: "1px solid #ccc", backgroundColor:"#f0f0f0"}}>
                    <button type="button" onClick={(event) => {
                        event.stopPropagation();
                        if (contextMenu.selectedAssignment && contextMenu.selectedAssignment) {
                            handlePublish(contextMenu.selectedAssignment);
                        }
                    }}>
                        {contextMenu.selectedAssignment && contextMenu.selectedAssignment.isPublished ? 'Unpublish' : 'Publish'}
                    </button>
                </li>
            </ul>
        );
    };
    


    return (
        <>
        <div className="flex-fill">
            {/* {<!-- Add buttons and other fields here -->} */}
            <div style={{margin:"5px", padding:"10px"}}>
                              <li className="list-group-item d-flex justify-content-end align-items-center">
                                <div className="col float-start">
                                  
                                  <input type="text" className="form-control w-25" id="points" placeholder="Search for Quiz"/>
                                </div>
                                  <button type="button" className="btn btn-danger float end m-1">
                                    + Quiz
                                  </button>
                                  <button type="button" className="btn btn-light float-end">
                                    <FaEllipsisV/>
                                  </button>
                                  
                              </li>
                        
            </div>
            <hr style={{color:"grey", marginRight:"20px", marginLeft:"20px", marginTop:"10px", marginBottom:"10px"}} />
            <ul className="list-group wd-modules">
                <li className="list-group-item">
                    <div>
                        <PiDotsSixVerticalBold style={{fontSize:"1.3em"}}/> 
                        <FaCaretDown className="ms-2 me-2"/>
                        <span style={{fontWeight:"bold"}}>Assignment Quizzes</span>
                    
                    </div>
                    <ul className="list-group">
                        {assignmentList
                        .filter((assignment) => assignment.course === courseId  && (assignment.category === "QUIZZES" || assignment.category === "EXAM"))
                        .map((assignment, index) => (
                        <li key={index} className="list-group-item">
                            <PiDotsSixVerticalBold style={{fontSize:"1.3em"}}/> 
                            <RxRocket className="ms-3" style={{color:"green"}}/>                           
                            <Link to={`/Kanbas/Courses/${courseId}/Quizzes/${assignment._id}`} style={{textDecoration:"none", color:"black", fontWeight:"bold"}} className="ms-3" >{assignment.title}</Link>
                            <div className="ms-3 mb-2" style={{flexWrap:"wrap", overflowWrap:"break-word"}}>    
                                <Link to="#" className="" style={{textDecoration: "none", color:"grey", fontSize:"0.8em", marginLeft:"55px"}}>{determineQuizAvailability(assignment.availableFromDate, assignment.availableUntilDate)}  </Link> 
                                <span style={{color:"grey", fontSize:"0.8em"}}>| Due {formatDate(assignment.dueDate)}  </span>
                                {assignment.isPublished && (
                                    <>
                                        <span style={{color:"grey", fontSize:"0.8em"}}>| {assignment.pts} pts  </span>
                                        <span style={{color:"grey", fontSize:"0.8em"}}>| {assignment.Questions} Questions  </span>
                                    </>
                                )}
                                <span className="float-end">
                                    {assignment.isPublished ? (
                                        <FaCheckCircle className="text-success me-3" onClick={() => handlePublish(assignment._id)}/>
                                    ) : (
                                        <RiProhibitedLine className="text-muted me-3" onClick={() => handlePublish(assignment._id)} />
                                    )}
                                    <button onClick={(e) => handleContextMenu(e, assignment._id)} style={{backgroundColor:"white"}}>
                                        <FaEllipsisV className="me-4"/>
                                    </button>  
                                    {renderContextMenu()}  
                                </span>
                            </div>    
                            
                        </li>))}
                    </ul>
                </li>

            </ul>
        </div>
        </>
    );

} 
export default Quizzes;