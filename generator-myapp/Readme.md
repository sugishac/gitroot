# Lifecycle of Yeoman Generator

initializing - Your initialization methods (checking current project state, getting configs, etc)
prompting - Where you prompt users for options (where you’d call this.prompt())
configuring - Saving configurations and configure the project (creating .editorconfig files and other metadata files)
default - If the method name doesn’t match a priority, it will be pushed to this group.
writing - Where you write the generator specific files (routes, controllers, etc)
conflicts - Where conflicts are handled (used internally)
install - Where installations are run (npm, bower)
end - Called last, cleanup, say good bye, etc

# Rules for defining a function 

Defining a function that won't be called automatically using underscore or define them 
in the constructor.

Example
-------
_private_method() {
    console.log('private hey');
  }