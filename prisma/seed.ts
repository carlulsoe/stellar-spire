import { faker } from '@faker-js/faker'
import { promiseHash } from 'remix-utils/promise'
import { prisma } from '#app/utils/db.server.ts'
import { MOCK_CODE_GITHUB } from '#app/utils/providers/constants'
import {
	cleanupDb,
	createPassword,
	createUser,
	getUserImages,
	img,
} from '#tests/db-utils.ts'
import { insertGitHubUser } from '#tests/mocks/github.ts'

async function seed() {
	console.log('🌱 Seeding...')
	console.time(`🌱 Database has been seeded`)

	console.time('🧹 Cleaned up the database...')
	await cleanupDb(prisma)
	console.timeEnd('🧹 Cleaned up the database...')

	console.time('🔑 Created permissions...')
	const entities = ['user', 'story', 'chapter', 'comment']
	const actions = ['create', 'read', 'update', 'delete']
	const accesses = ['own', 'any'] as const

	let permissionsToCreate = []
	for (const entity of entities) {
		for (const action of actions) {
			for (const access of accesses) {
				permissionsToCreate.push({ entity, action, access })
			}
		}
	}
	await prisma.permission.createMany({ data: permissionsToCreate })
	console.timeEnd('🔑 Created permissions...')

	console.time('👑 Created roles...')
	await prisma.role.create({
		data: {
			name: 'admin',
			permissions: {
				connect: await prisma.permission.findMany({
					select: { id: true },
					where: { access: 'any' },
				}),
			},
		},
	})
	await prisma.role.create({
		data: {
			name: 'user',
			permissions: {
				connect: await prisma.permission.findMany({
					select: { id: true },
					where: { access: 'own' },
				}),
			},
		},
	})
	console.timeEnd('👑 Created roles...')

	const totalUsers = 5
	console.time(`👤 Created ${totalUsers} users...`)
	const userImages = await getUserImages()

	for (let index = 0; index < totalUsers; index++) {
		const userData = createUser()
		await prisma.user
			.create({
				select: { id: true },
				data: {
					...userData,
					password: { create: createPassword(userData.username) },
					image: { create: userImages[index % userImages.length] },
					roles: { connect: { name: 'user' } },
					stories: {
						create: Array.from({
							length: faker.number.int({ min: 1, max: 3 }),
						}).map(() => ({
							title: faker.lorem.sentence(),
							description: faker.lorem.paragraphs(1),
							chapters: {
								create: {
									title: faker.lorem.sentence(),
									content: faker.lorem.paragraphs(4),
								},
							},
						})),
					},
				},
			})
			.catch((e) => {
				console.error('Error creating a user:', e)
				return null
			})
	}
	console.timeEnd(`👤 Created ${totalUsers} users...`)

	console.time(`🐨 Created admin user "kody"`)

	const kodyImages = await promiseHash({
		kodyUser: img({ filepath: './tests/fixtures/images/user/kody.png' }),
		cuteKoala: img({
			altText: 'an adorable koala cartoon illustration',
			filepath: './tests/fixtures/images/kody-notes/cute-koala.png',
		}),
		koalaEating: img({
			altText: 'a cartoon illustration of a koala in a tree eating',
			filepath: './tests/fixtures/images/kody-notes/koala-eating.png',
		}),
		koalaCuddle: img({
			altText: 'a cartoon illustration of koalas cuddling',
			filepath: './tests/fixtures/images/kody-notes/koala-cuddle.png',
		}),
		mountain: img({
			altText: 'a beautiful mountain covered in snow',
			filepath: './tests/fixtures/images/kody-notes/mountain.png',
		}),
		koalaCoder: img({
			altText: 'a koala coding at the computer',
			filepath: './tests/fixtures/images/kody-notes/koala-coder.png',
		}),
		koalaMentor: img({
			altText:
				'a koala in a friendly and helpful posture. The Koala is standing next to and teaching a woman who is coding on a computer and shows positive signs of learning and understanding what is being explained.',
			filepath: './tests/fixtures/images/kody-notes/koala-mentor.png',
		}),
		koalaSoccer: img({
			altText: 'a cute cartoon koala kicking a soccer ball on a soccer field ',
			filepath: './tests/fixtures/images/kody-notes/koala-soccer.png',
		}),
	})

	const githubUser = await insertGitHubUser(MOCK_CODE_GITHUB)

	await prisma.user.create({
		select: { id: true },
		data: {
			email: 'kody@kcd.dev',
			username: 'kody',
			name: 'Kody',
			image: { create: kodyImages.kodyUser },
			password: { create: createPassword('kodylovesyou') },
			connections: {
				create: { providerName: 'github', providerId: githubUser.profile.id },
			},
			roles: { connect: [{ name: 'admin' }, { name: 'user' }] },
			stories: {
				create: [
					{
						id: 'd27a197e',
						title: 'Basic Koala Facts',
						description:
							'Koalas are found in the eucalyptus forests of eastern Australia. They have grey fur with a cream-coloured chest, and strong, clawed feet, perfect for living in the branches of trees!',
						chapters: {
							create: {
								title: 'Basic Koala Facts',
								content:
									'Koalas are found in the eucalyptus forests of eastern Australia. They have grey fur with a cream-coloured chest, and strong, clawed feet, perfect for living in the branches of trees!',
							},
						},
					},
					{
						id: '414f0c09',
						title: 'Koalas like to cuddle',
						description:
							'Cuddly critters, koalas measure about 60cm to 85cm long, and weigh about 14kg.',
						chapters: {
							create: {
								title: 'Koalas like to cuddle',
								content:
									'Cuddly critters, koalas measure about 60cm to 85cm long, and weigh about 14kg.',
							},
						},
					},
					{
						id: '260366b1',
						title: 'Not bears',
						description:
							"Although you may have heard people call them koala 'bears', these awesome animals aren’t bears at all – they are in fact marsupials. A group of mammals, most marsupials have pouches where their newborns develop.",
						chapters: {
							create: {
								title: 'Not bears',
								content:
									"Although you may have heard people call them koala 'bears', these awesome animals aren’t bears at all – they are in fact marsupials. A group of mammals, most marsupials have pouches where their newborns develop.",
							},
						},
					},
					{
						id: 'bb79cf45',
						title: 'Snowboarding Adventure',
						description:
							"Today was an epic day on the slopes! Shredded fresh powder with my friends, caught some sick air, and even attempted a backflip. Can't wait for the next snowy adventure!",
						chapters: {
							create: {
								title: 'Snowboarding Adventure',
								content:
									"Today was an epic day on the slopes! Shredded fresh powder with my friends, caught some sick air, and even attempted a backflip. Can't wait for the next snowy adventure!",
							},
						},
					},
					{
						id: '9f4308be',
						title: 'Onewheel Tricks',
						description:
							"Mastered a new trick on my Onewheel today called '180 Spin'. It's exhilarating to carve through the streets while pulling off these rad moves. Time to level up and learn more!",
						chapters: {
							create: {
								title: 'Onewheel Tricks',
								content:
									"Mastered a new trick on my Onewheel today called '180 Spin'. It's exhilarating to carve through the streets while pulling off these rad moves. Time to level up and learn more!",
							},
						},
					},
					{
						id: '306021fb',
						title: 'Coding Dilemma',
						description:
							"Stuck on a bug in my latest coding project. Need to figure out why my function isn't returning the expected output. Time to dig deep, debug, and conquer this challenge!",
						chapters: {
							create: {
								title: 'Coding Dilemma',
								content:
									"Stuck on a bug in my latest coding project. Need to figure out why my function isn't returning the expected output. Time to dig deep, debug, and conquer this challenge!",
							},
						},
					},
					{
						id: '16d4912a',
						title: 'Coding Mentorship',
						description:
							"Had a fantastic coding mentoring session today with Sarah. Helped her understand the concept of recursion, and she made great progress. It's incredibly fulfilling to help others improve their coding skills.",
						chapters: {
							create: {
								title: 'Coding Mentorship',
								content:
									"Had a fantastic coding mentoring session today with Sarah. Helped her understand the concept of recursion, and she made great progress. It's incredibly fulfilling to help others improve their coding skills.",
							},
						},
					},
					{
						id: '3199199e',
						title: 'Koala Fun Facts',
						description:
							"Did you know that koalas sleep for up to 20 hours a day? It's because their diet of eucalyptus leaves doesn't provide much energy. But when I'm awake, I enjoy munching on leaves, chilling in trees, and being the cuddliest koala around!",
						chapters: {
							create: {
								title: 'Koala Fun Facts',
								content:
									"Did you know that koalas sleep for up to 20 hours a day? It's because their diet of eucalyptus leaves doesn't provide much energy. But when I'm awake, I enjoy munching on leaves, chilling in trees, and being the cuddliest koala around!",
							},
						},
					},
					{
						id: '2030ffd3',
						title: 'Skiing Adventure',
						description:
							'Spent the day hitting the slopes on my skis. The fresh powder made for some incredible runs and breathtaking views. Skiing down the mountain at top speed is an adrenaline rush like no other!',
						chapters: {
							create: {
								title: 'Skiing Adventure',
								content:
									'Spent the day hitting the slopes on my skis. The fresh powder made for some incredible runs and breathtaking views. Skiing down the mountain at top speed is an adrenaline rush like no other!',
							},
						},
					},
					{
						id: 'f375a804',
						title: 'Code Jam Success',
						description:
							'Participated in a coding competition today and secured the first place! The adrenaline, the challenging problems, and the satisfaction of finding optimal solutions—it was an amazing experience. Feeling proud and motivated to keep pushing my coding skills further!',
						chapters: {
							create: {
								title: 'Code Jam Success',
								content:
									'Participated in a coding competition today and secured the first place! The adrenaline, the challenging problems, and the satisfaction of finding optimal solutions—it was an amazing experience. Feeling proud and motivated to keep pushing my coding skills further!',
							},
						},
					},
					{
						id: '562c541b',
						title: 'Koala Conservation Efforts',
						description:
							"Joined a local conservation group to protect koalas and their habitats. Together, we're planting more eucalyptus trees, raising awareness about their endangered status, and working towards a sustainable future for these adorable creatures. Every small step counts!",
						chapters: {
							create: {
								title: 'Koala Conservation Efforts',
								content:
									"Joined a local conservation group to protect koalas and their habitats. Together, we're planting more eucalyptus trees, raising awareness about their endangered status, and working towards a sustainable future for these adorable creatures. Every small step counts!",
							},
						},
					},
					// extra long note to test scrolling
					{
						id: 'f67ca40b',
						title: 'Game day',
						description:
							"Just got back from the most amazing game. I've been playing soccer for a long time, but I've not once scored a goal. Well, today all that changed! I finally scored my first ever goal.\n\nI'm in an indoor league, and my team's not the best, but we're pretty good and I have fun, that's all that really matters. Anyway, I found myself at the other end of the field with the ball. It was just me and the goalie. I normally just kick the ball and hope it goes in, but the ball was already rolling toward the goal. The goalie was about to get the ball, so I had to charge. I managed to get possession of the ball just before the goalie got it. I brought it around the goalie and had a perfect shot. I screamed so loud in excitement. After all these years playing, I finally scored a goal!\n\nI know it's not a lot for most folks, but it meant a lot to me. We did end up winning the game by one. It makes me feel great that I had a part to play in that.\n\nIn this team, I'm the captain. I'm constantly cheering my team on. Even after getting injured, I continued to come and watch from the side-lines. I enjoy yelling (encouragingly) at my team mates and helping them be the best they can. I'm definitely not the best player by a long stretch. But I really enjoy the game. It's a great way to get exercise and have good social interactions once a week.\n\nThat said, it can be hard to keep people coming and paying dues and stuff. If people don't show up it can be really hard to find subs. I have a list of people I can text, but sometimes I can't find anyone.\n\nBut yeah, today was awesome. I felt like more than just a player that gets in the way of the opposition, but an actual asset to the team. Really great feeling.\n\nAnyway, I'm rambling at this point and really this is just so we can have a note that's pretty long to test things out. I think it's long enough now... Cheers!",
					},
				],
			},
		},
	})
	console.timeEnd(`🐨 Created admin user "kody"`)

	await prisma.user.create({
		select: { id: true },
		data: {
			email: 'jrwordsmith@gmail.com',
			username: 'jrwordsmith',
			name: 'J.R. Wordsmith',
			image: { create: kodyImages.kodyUser },
			password: { create: createPassword('ilovewriting') },
			roles: { connect: [{ name: 'user' }] },
			stories: {
				create: [{
					title: 'The Enchanted Forest',
					description: 'A magical forest that is home to all kinds of creatures.',
					chapters: {
						create: {
							title: 'The Enchanted Forest',
							content: `Deep in the heart of an ancient woodland, where sunlight filtered through layers of emerald leaves, there stood a tree unlike any other. Its bark shimmered with an otherworldly glow, and its branches seemed to whisper secrets to those who listened closely.

    Lily, a curious young explorer with wild curls and bright eyes, had heard tales of this magical forest since she was a child. Now, at the age of twelve, she had finally convinced her parents to let her embark on a camping trip with her best friend, Max.

    As they ventured deeper into the woods, the air grew thick with mystery. Fireflies danced around them, leaving trails of golden light in their wake. The forest floor was soft beneath their feet, cushioned by years of fallen leaves and moss.

    "Do you think we'll find it?" Max whispered, his voice tinged with both excitement and apprehension.

    Lily nodded, her determination unwavering. "We have to. It's been calling to us in our dreams, remember?"

    Just as the words left her lips, they stumbled into a clearing bathed in moonlight. And there, in the center, stood the tree from their shared visions – its trunk spiraling towards the sky, branches adorned with leaves that sparkled like stardust.

    As they approached, the tree seemed to come alive. Its branches swayed gently, though there was no breeze. A soft humming filled the air, a melody so beautiful it brought tears to their eyes.

    Lily reached out, her fingertips barely grazing the glowing bark. In that instant, a flood of images rushed through her mind – ancient rituals, forgotten spells, and the faces of those who had stood in this very spot centuries ago.

    "We found it," she breathed, her voice filled with wonder. "The heart of the Enchanted Forest."

    Max grinned, squeezing her hand. "No, Lily. It found us."

    As the night deepened around them, Lily and Max knew their adventure was just beginning. The Enchanted Forest had chosen them, and with that choice came a responsibility they were only beginning to understand.

    The tree's glow pulsed gently, like a heartbeat, welcoming them home to a world of magic they had only dreamed of until now."
`
						},
					},
				}]
			}
		}
	})

	console.timeEnd(`🌱 Database has been seeded`)
}

seed()
	.catch((e) => {
		console.error(e)
		process.exit(1)
	})
	.finally(async () => {
		await prisma.$disconnect()
	})

// we're ok to import from the test directory in this file
/*
eslint
	no-restricted-imports: "off",
*/
