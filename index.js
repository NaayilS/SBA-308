// The provided course information.
const CourseInfo = {
    id: 451,
    name: "Introduction to JavaScript",
  };
  
  // The provided assignment group.
  const AssignmentGroup = {
    id: 12345,
    name: "Fundamentals of JavaScript",
    course_id: 451,
    group_weight: 25,
    assignments: [
      {
        id: 1,
        name: "Declare a Variable",
        due_at: "2023-01-25",
        points_possible: 50,
      },
      {
        id: 2,
        name: "Write a Function",
        due_at: "2023-02-27",
        points_possible: 150,
      },
      {
        id: 3,
        name: "Code the World",
        due_at: "3156-11-15",
        points_possible: 500,
      },
    ],
  };
  
  // The provided learner submission data.
  const LearnerSubmissions = [
    {
      learner_id: 125,
      assignment_id: 1,
      submission: {
        submitted_at: "2023-01-25",
        score: 47,
      },
    },
    {
      learner_id: 125,
      assignment_id: 2,
      submission: {
        submitted_at: "2023-02-12",
        score: 150,
      },
    },
    {
      learner_id: 125,
      assignment_id: 3,
      submission: {
        submitted_at: "2023-01-25",
        score: 400,
      },
    },
    {
      learner_id: 132,
      assignment_id: 1,
      submission: {
        submitted_at: "2023-01-24",
        score: 39,
      },
    },
    {
      learner_id: 132,
      assignment_id: 2,
      submission: {
        submitted_at: "2023-03-07",
        score: 140,
      },
    },
  ];
  
// Validate assignment group belongs to the course
function validateData(course, ag) {
    if (ag.course_id !== course.id) {
      throw new Error("Assignment group does not belong to the course");
    }
  }
  
  // Calculate percentage, adjusting for late submissions
  function calculatePercentage(score, pointsPossible, isLate) {
    if (pointsPossible === 0) {
      throw new Error("points_possible cannot be zero");
    }
    let adjustedScore = score;
    if (isLate) {
      adjustedScore = Math.max(0, score - pointsPossible * 0.1);
    }
    return adjustedScore / pointsPossible;
  }
  
  // Main function to process learner data
  function getLearnerData(course, ag, submissions) {
    try {
      // Validate that the assignment group belongs to the course
      validateData(course, ag);
  
      // Get the current date and time
      const now = new Date().toISOString();
      // Initialize an empty object to store learner data
      let learners = {};
  
      // Process each submission
      for (const submission of submissions) {
        const { learner_id, assignment_id, submission: { submitted_at, score } } = submission;
        
        // Find the corresponding assignment
        const assignment = ag.assignments.find((a) => a.id === assignment_id);
        if (!assignment) continue; // If no assignment found, skip to next submission
  
        const { due_at, points_possible } = assignment;
        if (new Date(due_at) > new Date(now)) continue; // Skip assignments not yet due
  
        // Determine if the submission was late
        const isLate = new Date(submitted_at) > new Date(due_at);
        // Calculate the percentage score
        const percentage = calculatePercentage(score, points_possible, isLate);
  
        // Initialize learner data
        if (!learners[learner_id]) {
          learners[learner_id] = {
            id: learner_id,
            totalScore: 0,
            totalPoints: 0,
          };
        }
  
        // Store the percentage score and update total scores and points
        learners[learner_id][assignment_id] = percentage;
        learners[learner_id].totalScore += percentage * points_possible;
        learners[learner_id].totalPoints += points_possible;
      }
  
      // Calculate average scores for each learner
      let result = [];
      for (const learner_id in learners) {
        const learner = learners[learner_id];
        learner.avg = learner.totalScore / learner.totalPoints;
        delete learner.totalScore;
        delete learner.totalPoints;
        result.push(learner);
      }
  
      // Return the final result
      return result;
    } catch (error) {
      console.error(error.message);
    }
  }
