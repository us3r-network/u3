import * as Yup from 'yup';

export default (str: string) => Yup.string().required().url().isValidSync(str);
