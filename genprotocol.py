#!/usr/bin/python

import ConfigParser
import json
import os
from jinja2 import Template

def genFields(config, section):
    return [(option, config.get(section, option)) for option in sorted(config.options(section))]

def genProtocol(input_file, options):
    config = ConfigParser.RawConfigParser()
    config.read(input_file)
    sections = config.sections()
    print sections
    result = [(section, genFields(config, section)) for section in sorted(sections)]
    print result
    return result

def genSource(languages, protocols):
    for lang in languages:
        template_file = os.path.join(os.path.dirname(__file__), 'templates/protocol.template.%s' % lang)
        template = open(template_file, 'r').read()
        template = Template(template)
        out = template.render(protocols)
        print out

def main():
    from optparse import OptionParser
    usage = 'usage: %prog protocol.ini [options]'
    parser = OptionParser(usage=usage)
    parser.add_option('-o', '--out', dest='output', help='write json to', metavar='FILE')
    parser.add_option('-q', '--quiet', dest='verbose', action='store_false', default=True, help="don't print messages to stdout")
    parser.add_option('-l', '--lang', dest='languages', help='languages file')

    (options, args) = parser.parse_args()
    if len(args) != 1:
        parser.error("incorrect number of arguments")
    protocols = genProtocol(args, options)

    # output json file
    if(options.output):
        fw = open(os.path.abspath(options.output), 'w')
        print json.dump(protocols, fw, indent=4)
    else:
        print json.dumps(protocols, indent=4)

    # output source file
    if options.languages:
        languages = options.languages.split(',')
        genSource(languages, { 'protocols': protocols })

if __name__ == '__main__':
    main()
