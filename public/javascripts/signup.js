angular.module('myApp')
.component('signup', {
  template: `
  <div class="container">
    <div class="row">
      <div class="col-sm-12">
        <h1>Sign up</h1>
      </div>
      <div class="col-sm-12">
        <form class="form" name="form" ng-submit="$ctrl.register(form)" novalidate>
          <div class="form-group" ng-class="{ 'has-success': form.firstName.$valid && $ctrl.submitted,
                                              'has-error': form.firstName.$invalid && $ctrl.submitted }">
            <label>First Name</label>
            <input type="text" name="firstName" class="form-control" ng-model="$ctrl.user.firstName"
                   required/>
            <p class="help-block" ng-show="form.firstName.$error.required && $ctrl.submitted">
              A first name is required
            </p>
          </div>
          <div class="form-group" ng-class="{ 'has-success': form.lastName.$valid && $ctrl.submitted,
                                              'has-error': form.lastName.$invalid && $ctrl.submitted }">
            <label>Last Name</label>
            <input type="text" name="lastName" class="form-control" ng-model="$ctrl.user.lastName"
                   required/>
            <p class="help-block" ng-show="form.lastName.$error.required && $ctrl.submitted">
              A last name is required
            </p>
          </div>
          <div class="form-group" ng-class="{ 'has-success': form.email.$valid && $ctrl.submitted,
                                              'has-error': form.email.$invalid && $ctrl.submitted }">
            <label>Email</label>
            <input type="email" name="email" class="form-control" ng-model="$ctrl.user.email"
                   required
                   mongoose-error/>
            <p class="help-block" ng-show="form.email.$error.email && $ctrl.submitted">
              Doesn't look like a valid email.
            </p>
            <p class="help-block" ng-show="form.email.$error.required && $ctrl.submitted">
              What's your email address?
            </p>
            <p class="help-block" ng-show="form.email.$error.reject && $ctrl.submitted">
              That email is already in use.
            </p>
            <p class="help-block" ng-show="form.email.$error.mongoose">
              {{ $ctrl.errors.email }}
            </p>
          </div>
          <div class="form-group" ng-class="{ 'has-success': form.password.$valid && $ctrl.submitted,
                                              'has-error': form.password.$invalid && $ctrl.submitted }">
            <label>Password</label>
            <input type="password" name="password" class="form-control" ng-model="$ctrl.user.password"
                   ng-minlength="3"
                   required
                   mongoose-error/>
            <p class="help-block"
               ng-show="(form.password.$error.minlength || form.password.$error.required) && $ctrl.submitted">
              Password must be at least 3 characters.
            </p>
            <p class="help-block" ng-show="form.password.$error.mongoose">
              {{ $ctrl.errors.password }}
            </p>
          </div>
          <div class="form-group" ng-class="{ 'has-success': form.confirmPassword.$valid && $ctrl.submitted,
                                              'has-error': form.confirmPassword.$invalid && $ctrl.submitted }">
            <label>Confirm Password</label>
            <input type="password" name="confirmPassword" class="form-control" ng-model="$ctrl.user.confirmPassword"
                   match="$ctrl.user.password"
                   ng-minlength="3" required/>
            <p class="help-block"
               ng-show="form.confirmPassword.$error.match && $ctrl.submitted">
              Passwords must match.
            </p>
          </div>
          <div>
            <button class="btn btn-default btn-lg btn-register" type="submit">
              Sign up
            </button>
            <br>
            <br>
            <p>Already have an account?  Sign in <a ui-sref="login">here</a>.</p>
          </div>
        </form>
      </div>
    </div>
    <hr>
  </div>
  `,
  controller: function(Auth, $state) {
    this.register = function(form) {
      this.submitted = true;

      if (form.$valid) {
        return Auth.createUser({
          firstName: this.user.firstName,
          lastName: this.user.lastName,
          email: this.user.email,
          password: this.user.password
        })
        .then(() => {
          // Account created, redirect to restaurants
          $state.go('restaurants');
        })
        .catch(err => {
          console.log('SIGN UP - err.data:', err.data);
          err = err.data;
          console.log('AFTER ASSIGNED:', err);
          errors = {};
          // Update validity of form fields that match the mongoose errors
          angular.forEach(err.errors, (error, field) => {
            form[field].$setValidity('mongoose', false);
            this.errors[field] = error.message;
          });
        });
      }
    };
  }
});
