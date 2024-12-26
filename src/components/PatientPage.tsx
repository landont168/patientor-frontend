import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

// gender icons
import MaleIcon from "@mui/icons-material/Male";
import FemaleIcon from "@mui/icons-material/Female";
import TransgenderIcon from "@mui/icons-material/Transgender";

import patientService from "../services/patients";
import {
  Patient,
  Entry,
  HospitalEntry,
  HealthCheckEntry,
  OccupationalHealthcareEntry,
} from "../types";

const PatientPage = () => {
  const [patient, setPatient] = useState<Patient>();
  const id = useParams<{ id: string }>().id;

  useEffect(() => {
    const fetchPatient = async () => {
      if (id) {
        const patientData = await patientService.getPatient(id);
        setPatient(patientData);
      }
    };
    fetchPatient();
  }, [id]);

  if (!patient) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>
        {patient.name}
        {patient.gender === "male" && <MaleIcon />}
        {patient.gender === "female" && <FemaleIcon />}
        {patient.gender === "other" && <TransgenderIcon />}
      </h2>
      <div>ssn: {patient.ssn}</div>
      <div>occupation: {patient.occupation}</div>
      <h2>entries</h2>
      {patient.entries.map((entry) => (
        <div key={entry.id}>
          <EntryDetails entry={entry} />
          <br />
        </div>
      ))}
    </div>
  );
};

const assertNever = (value: never): never => {
  throw new Error(
    `Unhandled discriminated union member: ${JSON.stringify(value)}`
  );
};

const EntryDetails = ({ entry }: { entry: Entry }) => {
  switch (entry.type) {
    case "Hospital":
      return <HospitalEntryDetails entry={entry} />;
    case "OccupationalHealthcare":
      return <OccupationalHealthcareEntryDetails entry={entry} />;
    case "HealthCheck":
      return <HealthCheckEntryDetails entry={entry} />;
    default:
      return assertNever(entry);
  }
};

const HospitalEntryDetails = ({ entry }: { entry: HospitalEntry }) => {
  return (
    <div>
      <div>{entry.date}</div>
      <div>
        <em>{entry.description}</em>
      </div>
      <div>
        <strong>Discharge:</strong> {entry.discharge.date}:{" "}
        {entry.discharge.criteria}
      </div>
      <div>diagnose by: {entry.specialist}</div>
    </div>
  );
};

const HealthCheckEntryDetails = ({ entry }: { entry: HealthCheckEntry }) => {
  return (
    <div>
      <div>{entry.date}</div>
      <div>
        <em>{entry.description}</em>
      </div>
      <div>health check rating: {entry.healthCheckRating}</div>
      <div>diagnose by: {entry.specialist}</div>
    </div>
  );
};

const OccupationalHealthcareEntryDetails = ({
  entry,
}: {
  entry: OccupationalHealthcareEntry;
}) => {
  return (
    <div>
      <div>{entry.date}</div>
      <div>
        <em>{entry.description}</em>
      </div>
      <div>employer: {entry.employerName}</div>
      {entry.sickLeave && (
        <div>
          sick leave: {entry.sickLeave.startDate} - {entry.sickLeave.endDate}
        </div>
      )}
      <div>diagnose by: {entry.specialist}</div>
    </div>
  );
};

export default PatientPage;
