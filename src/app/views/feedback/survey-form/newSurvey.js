import React, { useState,useEffect } from "react";
import { Formik } from "formik";
import {
  Grid,
  Card,
  Divider,
  TextField,
  MenuItem,
  Button,
  DialogTitle,
  Dialog,
  DialogContent,
  DialogActions,
} from "@material-ui/core";
import { Breadcrumb } from "matx";
import bc from "app/services/breathecode";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { makeStyles } from "@material-ui/core/styles";
import { Typography } from "@material-ui/core";

const useStyles = makeStyles(({ palette, ...theme }) => ({
    select: {
      width: "15rem",
    },
  }));

const NewSurvey = () => {
  const [listCohorts, setListCohort] = useState(undefined); 
  const [cohortName, setcohortName] = useState();
  const [cohort, setCohort] = useState();
  const [newSurvey, setNewSurvey] = useState(
    {
      cohort: "",
      max_assistants: 2,
      max_teachers: 2, 
      duration: 1,
      send_now: false
    }
  ); 
  const [id, setId] = useState(null);
  const [cohortNameInDialog, setCohortNameInDialog] = useState(null)

  const history = useHistory();
  const classes = useStyles();

  const [open, setOpen] = useState(false);
    
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  // AUX´s FUNCTION TO HELP IN VALIDATIONS AND CREATE DE OBJECT "newSurvey" \\

   useEffect(() => {
    bc.admissions().getAllCohorts(0)
        .then(({data}) => {
            setListCohort(data)
        })
    }, [])

    useEffect(() => {
        listCohorts != undefined
            ? setcohortName(listCohorts.map(item => (
                <MenuItem key = {item.name} value = {item.id} onCLick = {console.log(item.name)}>
                    {item.name}
                </MenuItem>
            )))
            : console.log("");
    }, [listCohorts != undefined])

    const createSurvey = event => {
            setNewSurvey({ ...newSurvey, [event.target.name]: event.target.value });
        };
    
    const selectCohort = (event) => {
        setCohort(event.target.value)
        setNewSurvey({
            ...newSurvey, cohort: event.target.value
        })
    }

  return (
    <div className = "m-sm-30">
      <div className = "mb-sm-30">
      <Breadcrumb
          routeSegments = {[
            { name: "Feedback", path: "/feedback/surveys" },
            { name: "Survey List", path: "/feedback/surveys"},
            { name: "New Survey"}
          ]}
        />
      </div>

      <Card elevation = {3}>
        <div className = "flex p-4">
          <h4 className = "m-0">Add New Survey</h4>
        </div>
        <Divider className = "mb-2" />

        <Formik
          initialValues = {newSurvey}
          onSubmit = {async(newSurvey) => 
            bc.feedback().addNewSurvey(newSurvey)
              .then(({ data }) => 
                setId(data.id))
          }
          enableReinitialize = {true}
        >
          {({
            values,
            errors,
            touched,
            handleChange,
            handleBlur,
            handleSubmit,
            isSubmitting,
            setSubmitting,
            setFieldValue,
          }) => (
            <form className = "p-4" onSubmit = {handleSubmit}>
              <Grid container spacing = {3} alignItems = "center">
                <Grid item md = {2} sm = {4} xs = {12}>
                    Cohort
                </Grid>
                <Grid item md = {10} sm = {8} xs = {12}>
                  <TextField
                    select
                    className={classes.select}
                    label = "Cohort"
                    name = "cohort"
                    size = "small"
                    variant = "outlined"
                    value = {cohort}
                    onChange = {(e) => {
                      selectCohort(e);
                      console.log(cohort);
                    }}
                    >
                      {cohortName}
                    </TextField>
                </Grid>
                <Grid item md = {2} sm = {4} xs = {12}>
                    Max assistants to ask:
                </Grid>
                <Grid item md = {10} sm = {8} xs = {12}>
                  <TextField
                    type="number"
                    label = "Max assistants"
                    name = "max_assistants"
                    size = "small"
                    variant = "outlined"
                    defaultValue = {newSurvey.max_assistants}
                    onChange = {createSurvey}
                  />
                </Grid>
                <Grid item md = {2} sm = {4} xs = {12}>
                    Max assistants of teachers:
                </Grid>
                <Grid item md = {10} sm = {8} xs = {12}>
                  <TextField
                    type="number"
                    label = "Max teachers"
                    name = "max_teachers"
                    size = "small"
                    variant = "outlined"
                    defaultValue = {newSurvey.max_teachers}
                    onChange = {createSurvey}
                  />
                </Grid>
                <Grid item md = {2} sm = {4} xs = {12}>
                    Duration:
                </Grid>
                <Grid item md = {10} sm = {8} xs = {12}>
                  <TextField
                    type="number"
                    label = "Duration"
                    name = "duration"
                    size = "small"
                    variant = "outlined"
                    defaultValue = {newSurvey.duration}
                    onChange = {createSurvey}
                  />
                </Grid>
                  <Button 
                    color = "primary" 
                    variant = "contained" 
                    type = "submit" 
                    onClick={()=> {
                      handleClickOpen(true);
                      }}>
                    Create
                  </Button>
              </Grid>
            </form>
          )}
        </Formik>
        </Card>
        <Dialog
          onClose={handleClose}
          open={open}
          aria-labelledby="simple-dialog-title"
        > 
          <DialogTitle id="simple-dialog-title">
              Are you sure?
          </DialogTitle>
          <DialogContent>
            <Typography gutterBottom>
              {`Cohort: ${newSurvey.cohort}`} 
            </Typography>
            <Typography gutterBottom>
              {`Max assistant to ask: ${newSurvey.max_assistants}`} 
            </Typography>
            <Typography gutterBottom>
              Max teachers: <span className="fs-5 fw-bolder">{newSurvey.max_teachers}</span>
            </Typography>
              <Typography gutterBottom>
              {`Duration: ${newSurvey.duration}`} 
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button 
              color = "primary" 
              variant = "contained" 
              type = "submit" 
              onClick={() => {
                handleClose();
              }}>
              Save as a draft
            </Button>
            <Button 
              color = "success" 
              variant = "contained" 
              type = "submit" 
              onClick={() => {
                bc.feedback().updateSurvey({
                  send_now: true
                }, id);
                console.log(newSurvey);
                handleClose();
              }}>
              Send now
            </Button>
            <Button 
              color = "danger" 
              variant = "contained" 
              onClick={handleClose}>
              Delete
            </Button>
          </DialogActions>
      </Dialog>
      
    </div>
  );
};

export default NewSurvey;