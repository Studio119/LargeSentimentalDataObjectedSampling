with open('./93.json', encoding='utf-8') as file:
	text = "".join([x.replace('\n', '').replace('  }', '}').replace(': ', ':').replace('\t', '').replace('  {', '{') for x in file.readlines()])
	with open('./93_new.json', encoding='utf-8', mode='w') as output:
		output.write(text)
		pass
	pass

