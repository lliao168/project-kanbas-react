import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate} from "react-router-dom";
import { assignments } from "../../Database";
import { useSelector, useDispatch } from "react-redux";
import { KanbasState } from "../../store";
import { PiPencil } from "react-icons/pi";

import {
    addAssignment,
    deleteAssignment,
    updateAssignment,
    selectAssignment,
  } from "../../Courses/Assignments/assignmentsReducer";

import * as client from "../../Courses/Assignments/client";  

import { findAssignmentsForCourse, createAssignment } from "../../Courses/Assignments/client";

function QuizDetailsScreen() {
    const { courseId, quizId } = useParams();
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

    const assignment = assignmentList.find(
        (assignment) => assignment.course === courseId && (assignment.category === "QUIZZES" || assignment.category === "EXAM")
    );

    const handleEditClick = () => {
        navigate(`/Kanbas/Courses/${courseId}/Quizzes/${assignment._id}/Editor`);
    };

return  (
    <div>

        {assignment && (
                <button type="button" onClick={handleEditClick} className="btn btn-light float-end m-2">
                    <PiPencil /> Edit
                </button>
        )}
        
    </div>

);

}
export default QuizDetailsScreen;