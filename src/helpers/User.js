import store from '../store';

class User {
  constructor(userdata = store.state.app.user) {
    this.id = userdata.id;
    this.firstName = userdata.firstName;
    this.lastName = userdata.lastName;
    this.email = userdata.email;
    this.picture = userdata.picture;
    this.agreedTOS = userdata.agreedTOS;
    this.username = userdata.username;
    this.phone = userdata.phone;
    this.roles = userdata.roles;
    this.assigned = userdata.jobs;
    this.requests = userdata.request;
    this.jobs = userdata.jobs;

    this.rolesSimple = userdata.roles.map(role => role.role);
    this.jobsSimple = userdata.jobs.map(job => job.id);
  }
  hasRole(role) {
    return this.rolesSimple.indexOf(role) > -1;
  }
  isTechnician() {
    return (this.hasRole('Technician') || this.hasRole('Admin'));
  }
  hasJob(jobId) {
    return this.jobsSimple.indexOf(jobId) > -1;
  }
}

export default User;
