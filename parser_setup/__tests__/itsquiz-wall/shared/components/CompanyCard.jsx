import React, { Component, PropTypes } from 'react';
import Button from 'react-mdl/lib/Button';

export class CompanyCard extends Component {
    static propTypes = {
        companyName : PropTypes.string,
        country     : PropTypes.string,
        city        : PropTypes.string,
        onClick     : PropTypes.string
    };

    render() {
        const { companyName, country, city, onClick } = this.props;

        return (
            <div clasName='CompanyCard'>
                Company {companyName} from {country} {city}

                <Button
                    colored
                    onClick={onClick}
                >
                    View details
                </Button>
            </div>
        );
    }
}

