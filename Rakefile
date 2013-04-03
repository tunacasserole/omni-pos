# List of environments and their heroku git remotes
REMOTES = {
  :staging    => 'omni-pos-qa',
  :production => 'omni-pos'
}

namespace :pos do
  namespace :deploy  do
    REMOTES.keys.each do |env|
      desc "Deploy to #{env} remote at Heroku"
      task env do
        current_branch = `git branch | grep ^* | awk '{ print $2 }'`.strip
   
        Rake::Task['pos:deploy:before_deploy'].invoke(env, current_branch)
        Rake::Task['pos:deploy:update_code'].invoke(env, current_branch)
        Rake::Task['pos:deploy:after_deploy'].invoke(env, current_branch)
      end
    end
   
    task :before_deploy, :env, :branch do |t, args|
      puts "Deploying #{args[:branch]} to #{args[:env]}"
   
      # Ensure the user wants to deploy a non-master branch to production
      if args[:env] == :production && args[:branch] != 'master'
        print "Are you sure you want to deploy '#{args[:branch]}' to production? (y/n) " and STDOUT.flush
        char = $stdin.getc
        if char != ?y && char != ?Y
          puts "Deploy aborted"
          exit 
        end
      end
    end
   
    task :after_deploy, :env, :branch do |t, args|
      puts "Deployment Complete"
    end
   
    task :update_code, :env, :branch do |t, args|
        puts "Updating #{REMOTES[args[:env]]} with branch #{args[:branch]}"
        `git push #{REMOTES[args[:env]]} +#{args[:branch]}:master`
    end
  end
end