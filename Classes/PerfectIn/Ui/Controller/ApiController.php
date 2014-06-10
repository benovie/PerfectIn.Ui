<?php

namespace PerfectIn\Ui\Controller;

use TYPO3\Flow\Annotations as Flow;

/**
 * handle api
 *
 * @Flow\Scope("singleton")
 */
class ApiController extends \TYPO3\Flow\Mvc\Controller\ActionController {	
	
	/**
	 * output api
	 * 
	 * @return string
	 */
	public function outputAction() {
		$contents = '';
		foreach ($this->settings['Api']['files'] AS $file) {
			$contents .= file_get_contents($file);
		}	
		$this->response->setHeader('Content-type', 'text/javascript');
		return $contents;
	}
	
}