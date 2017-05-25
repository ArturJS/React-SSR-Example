import Validators from './Validators';

const {
	required,
	minLength,
	regex
} = Validators;

describe('Validators', () => {
	describe('"required" method', () => {
		it('returns error (in case of empty string)', () => {
			const error = 'Field is required';
			expect(required(error)('')).toBe(error);
		});

		it('returns null (in case of NOT empty string)', () => {
			const error = 'Field is required';
			expect(required(error)('123')).toBe(null);
		});
	});

	describe('"minLength" method', () => {
		it('returns error (in case of short string)', () => {
			const error = 'minLength error';
			expect(minLength(5, error)('123')).toBe(error);
		});

		it('returns null (in case of long string)', () => {
			const error = 'minLength error';
			expect(minLength(5, error)('12345')).toBe(null);
		});
	});

	describe('"regex" method', () => {
		it('returns error (in case of not matching with regexp)', () => {
			const error = 'Regex error';
			expect(regex(/test/, error)('123')).toBe(error);
		});

		it('returns null (in case of NOT empty string)', () => {
			const error = 'Regex error';
			expect(regex(/test/, error)('test')).toBe(null);
		});
	});
});

