import SvgComponent from '@/utils/SvgComponent';
import React from 'react';

interface PasswordStrengthProps {
    passStrength: any;
}

const PasswordStrength: React.FC<PasswordStrengthProps> = ({ passStrength }) => {
    console.log(passStrength, "Passw")
    return (
        <div>
            <section className='flex gap-2 items-center'>
                <span>
                    {passStrength?.hasLimitCharacter ? <SvgComponent className="" svgName="success_password" /> : <SvgComponent className="" svgName="error_password" />}
                </span>
                <p className={passStrength?.hasLimitCharacter ? 'password_success' : 'password_error'}>{'Password must be of minimum 8 characters'}</p>
            </section>

            <section className='flex gap-2 items-center'>
                <span>
                    {passStrength?.hasUppercase && passStrength.hasLowercase ? <SvgComponent className="" svgName="success_password" /> : <SvgComponent className="" svgName="error_password" />}
                </span>
                <p className={passStrength?.hasUppercase && passStrength.hasLowercase ? 'password_success' : 'password_error'}>{'Upper & lowercase letters'}</p>
            </section>

            <section className='flex gap-2 items-center'>
                <span>
                    {passStrength?.hasNumber ? <SvgComponent className="" svgName="success_password" /> : <SvgComponent className="" svgName="error_password" />}
                </span>
                <p className={passStrength?.hasNumber ? 'password_success' : 'password_error'}>{'At least one number'}</p>
            </section>
        </div>
    );
};

export default PasswordStrength;
