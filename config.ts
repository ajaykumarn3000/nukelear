type ConfigItem = {
	name: string;
	value: string;
	directories: string[];
};

export const config: ConfigItem[] = [
	{
		name: 'Python',
		value: 'python',
		directories: ['venv', '.venv', '__pycache__'],
	},
	{
		name: 'Node.js',
		value: 'node',
		directories: ['node_modules', 'dist', 'build'],
	},
	{
		name: 'Next.js',
		value: 'next',
		directories: ['node_modules', '.next', 'dist', 'build'],
	},
	{
		name: 'MacOS',
		value: 'macos',
		directories: ['.DS_Store'],
	},
];
