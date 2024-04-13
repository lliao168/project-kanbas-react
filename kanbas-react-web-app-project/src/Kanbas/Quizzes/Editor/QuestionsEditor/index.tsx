import React, { useState, useEffect } from 'react';
import { FaCheckCircle, FaEllipsisV } from "react-icons/fa";
import { Link, useParams, useNavigate} from "react-router-dom";
import { FaCaretDown, FaPlus } from "react-icons/fa6";
import { HiOutlinePencilSquare } from "react-icons/hi2";
import { PiDotsSixVerticalBold } from "react-icons/pi";
import { useSelector, useDispatch } from "react-redux";
import { KanbasState } from '../../../store';
import { Modal, Button} from 'react-bootstrap';
import { RxRocket } from "react-icons/rx";
import { RiProhibitedLine } from "react-icons/ri";
import { FaXmark } from "react-icons/fa6";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { CiSearch } from "react-icons/ci";

import {
    addAssignment,
    deleteAssignment,
    updateAssignment,
    selectAssignment,
  } from "../../../Courses/Assignments/assignmentsReducer";

import * as client from "../../../Courses/Assignments/client";  
import { findAssignmentsForCourse, createAssignment } from "../../../Courses/Assignments/client";

function QuizQuestionsDetailEditor() {
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
    const assignment = useSelector((state: KanbasState) => state.assignmentsReducer.assignment);
    interface Assignment {
        _id: string;
        title: string;
        course: string;
        category: string;
        description: string;
        isPublished: boolean;
    }

    return(
        <div>
            
                <div className="d-flex justify-content-center mt-2">
                            <button className="btn btn-light ms-3">
                            + New Question
                            </button>
                            <Link to={"#"} className="btn btn-light ms-4">
                                + New Question Group
                            </Link>
                            <Link to={"#"}
                                className="btn btn-light ms-4">
                                <CiSearch className="me-2"/>Find Questions
                            </Link>
                </div> 
                
        </div>
    );
}
export default QuizQuestionsDetailEditor;