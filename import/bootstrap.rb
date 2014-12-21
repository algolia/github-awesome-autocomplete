#! /usr/bin/env ruby

require 'rubygems'
require 'algoliasearch'

if ARGV.size != 4
  $stderr << "#{__FILE__} /path/to/repositories.json /path/to/users.json ALGOLIA_APPLICATION_ID ALGOLIA_API_KEY\n"
  exit 1
end

Algolia.init application_id: ARGV[2], api_key: ARGV[3]

puts "* Pushing repositories"
repos = Algolia::Index.new('top_1m_repos')
repos.set_settings({
  attributesToIndex: ['name', 'unordered(full_name)', 'unordered(description)'],
  customRanking: ['desc(watchers)', 'desc(forks)'],
  attributesForFaceting: ['language', 'organization']
})
objects = []
File.read(ARGV[0]).each_line do |line|
  repo = JSON.parse(line)
  next if repo['owner'].nil? || repo['owner'] == '' # ? :)
  repo['objectID'] = repo['full_name'] = "#{repo['owner']}/#{repo['name']}"
  repo['watchers'] = repo['watchers'].to_i
  repo['forks'] = repo['forks'].to_i
  objects << repo
  if objects.size >= 10000
    puts "** Add #{objects.size} repositories"
    repos.add_objects(objects)
    objects = []
  end
end
if !objects.empty?
  puts "** Add #{objects.size} repositories"
  repos.add_objects(objects)
end

# puts "* Pushing users"
# users = Algolia::Index.new('last_1m_users')
# users.set_settings({
#   attributesToIndex: ['login', 'unordered(name)', 'unordered(email)', 'company', 'location', 'unordered(blog)'],
#   customRanking: ['asc(login)'],
#   attributesForFaceting: ['company', 'location']
# })
# objects = []
# File.read(ARGV[1]).each_line do |line|
#   user = JSON.parse(line)
#   user['objectID'] = user['login']
#   objects << user
#   if objects.size >= 10000
#     puts "** Add #{objects.size} users"
#     users.add_objects(objects)
#     objects = []
#   end
# end
# if !objects.empty?
#   puts "** Add #{objects.size} users"
#   users.add_objects(objects)
# end

