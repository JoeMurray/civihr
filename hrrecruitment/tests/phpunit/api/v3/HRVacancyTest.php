<?php
/*
+--------------------------------------------------------------------+
| CiviHR version 1.4                                                 |
+--------------------------------------------------------------------+
| Copyright CiviCRM LLC (c) 2004-2014                                |
+--------------------------------------------------------------------+
| This file is a part of CiviCRM.                                    |
|                                                                    |
| CiviCRM is free software; you can copy, modify, and distribute it  |
| under the terms of the GNU Affero General Public License           |
| Version 3, 19 November 2007 and the CiviCRM Licensing Exception.   |
|                                                                    |
| CiviCRM is distributed in the hope that it will be useful, but     |
| WITHOUT ANY WARRANTY; without even the implied warranty of         |
| MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.               |
| See the GNU Affero General Public License for more details.        |
|                                                                    |
| You should have received a copy of the GNU Affero General Public   |
| License and the CiviCRM Licensing Exception along                  |
| with this program; if not, contact CiviCRM LLC                     |
| at info[AT]civicrm[DOT]org. If you have questions about the        |
| GNU Affero General Public License or the licensing of CiviCRM,     |
| see the CiviCRM license FAQ at http://civicrm.org/licensing        |
+--------------------------------------------------------------------+
*/

require_once 'CiviTest/CiviUnitTestCase.php';

/**
 * Class api_v3_HRVacancyTest
 */
class api_v3_HRVacancyTest extends CiviUnitTestCase {
  protected $_apiversion = 3;

  function setUp() {
    $this->_entity = 'HRVacancy';

    parent::setUp();
    $this->_apiversion = 3;
    $this->tablesToTruncate = array('civicrm_hrvacancy');
    $this->quickCleanup($this->tablesToTruncate);
    $this->createLoggedInUser();
    $session = CRM_Core_Session::singleton();
    $this->_loggedInUser = $session->get('userID');
    //vacancy params
    $this->_params = array(
      'position' => 'Test',
      'is_template' => '0',
      'start_date' => '2014-05-08 00:00:00',
      'end_date' => '2014-05-27 00:00:00',
      'status_id' => 'Draft',
      'created_id' => $this->_loggedInUser,
    );
  }

  protected static function _populateDB($perClass = FALSE, &$object = NULL) {
    if (!parent::_populateDB($perClass, $object)) {
      return FALSE;
    }
    //populate vacancy_status of type Application
    $result = civicrm_api3('OptionGroup', 'create', array(
                'name' => 'vacancy_status',
                'title' => ts('Vacancy Status'),
                'is_reserved' => 1,
                'is_active' => 1,
              )
    );
    $vacancyStatus = array(
      'Draft' => ts('Draft'),
      'Open' => ts('Open'),
      'Closed' => ts('Closed'),
      'Cancelled' => ts('Cancelled'),
      'Rejected' => ts('Rejected')
    );
    $weight = 1;
    foreach ($vacancyStatus as $name => $label) {
      $statusParam = array(
        'option_group_id' => $result['id'],
        'label' => $label,
        'name' => $name,
        'value' => $weight++,
        'is_active' => 1,
      );
      if ($name == 'Draft') {
        $statusParam['is_default'] = 1;
      }
      elseif ($name == 'Open') {
        $statusParam['is_reserved'] = 1;
      }
      civicrm_api3('OptionValue', 'create', $statusParam);
    }

    $import = new CRM_Utils_Migrate_Import();
    $import->run(
      CRM_Extension_System::singleton()->getMapper()->keyToBasePath('org.civicrm.hrrecruitment')
      . '/xml/auto_install.xml'
    );
    return TRUE;
  }

  /**
   * Tears down the fixture, for example, closes a network connection.
   * This method is called after a test is executed.
   *
   */
  function tearDown() {
    $this->quickCleanup($this->tablesToTruncate, TRUE);
  }

  /**
   * Test delete function with valid parameters
   */
  function testVacancyDelete() {
    // Create vacancy
    $result = $this->callAPISuccess('HRVacancy', 'create', $this->_params);
    $id = $result['id'];
    $this->callAPISuccess('HRVacancy', 'delete', array('id' => $id));

    // Check result - vacancy should no longer exist
    $result = $this->callAPISuccess('HRVacancy', 'get', array('id' => $id));
    $this->assertEquals(0, $result['count']);
  }

  /**
   * test create methods with valid data
   * success expected
   */
  function testVacancyCreate() {
    // Create Vacancy
    $result = $this->callAPISuccess('HRVacancy', 'create', $this->_params);
    $id = $result['id'];

    // Check result
    $result = $this->callAPISuccess('HRVacancy', 'get', array('id' => $id));
    $this->assertEquals($result['values'][$id]['id'], $id, 'in line ' . __LINE__);
    $this->assertEquals($result['values'][$id]['position'], $this->_params['position'], 'in line ' . __LINE__);
  }

  /**
   * Test update (create with id) function with valid parameters
   */
  function testVacancyUpdate() {
    // Create Vacancy
    $result = $this->callAPISuccess('HRVacancy', 'create', $this->_params);
    $id = $result['id'];
    $result = $this->callAPISuccess('HRVacancy', 'get', array('id' => $id));
    $vacancy = $result['values'][$id];

    // Update vacancy
    //$params = array('id' => $id);
    $this->_params['id'] = $id;
    $this->_params['position'] = $vacancy['position'] = 'Something Else';
    $this->callAPISuccess('HRVacancy', 'create', $this->_params);

    // Verify that updated vacancy is exactly equal to the original with new position
    $result = $this->callAPISuccess('HRVacancy', 'get', array('id' => $id));
    $this->assertEquals($result['values'][$id], $vacancy, 'in line ' . __LINE__);
  }
}

